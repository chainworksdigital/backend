import os
import sys
import warnings
import json
import re
from typing import List
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.retrieval_qa.base import RetrievalQA
from rapidfuzz import process

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
mongo_uri = os.getenv("MONGO_URI")

if not api_key:
    raise ValueError("❌ Missing OpenAI API key. Set it in the environment or .env file.")
if not mongo_uri:
    raise ValueError("❌ Missing MongoDB URI. Set it in the environment or .env file.")

warnings.filterwarnings('ignore')

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client["your_database_name"]  # Replace with actual database name
trade_collection = db["trades"]

MD_FOLDER = "./markdown_files"  # Folder containing Markdown files


def fetch_trade_details(topic_name):
    """Fetch trade details using fuzzy matching."""
    print(f"📌 Searching for topic '{topic_name}' in MongoDB...")

    # Get all topics
    all_topics = []
    for doc in trade_collection.find():
        for module in doc.get("modules", []):
            for topic in module.get("topics", []):
                stored_topic = topic.get("name", "").strip()
                all_topics.append(stored_topic)

    if not all_topics:
        print("❌ No topics found in MongoDB!")
        sys.exit(1)

    # 🔹 Prioritize exact match before fuzzy matching
    best_match = None
    if topic_name in all_topics:
        best_match = topic_name
    else:
        best_match, score, _ = process.extractOne(topic_name, all_topics, score_cutoff=75)

    if best_match:
        print(f"✅ Best match found: '{best_match}' (Score: {score}%)")
        topic_name = best_match  # Use corrected name
    else:
        print(f"❌ No close match found for '{topic_name}'. Available topics: {all_topics}")
        sys.exit(1)

    # 🔹 Search in MongoDB
    query = {"modules.topics.name": {"$regex": f"^{re.escape(topic_name)}$", "$options": "i"}}
    trade_entry = trade_collection.find_one(query)

    if not trade_entry:
        print(f"❌ Still no trade entry found for '{topic_name}'. Available topics: {all_topics}")
        sys.exit(1)

    print(f"✅ Trade entry found: {trade_entry}")
    return trade_entry


def get_md_file(topic_name: str) -> str:
    """Finds the Markdown (.md) file based on the topic name."""
    normalized_topic = topic_name.replace(" ", "_")
    for file in os.listdir(MD_FOLDER):
        if file.lower().startswith(normalized_topic.lower()) and file.endswith(".md"):
            return os.path.join(MD_FOLDER, file)
    return None


def load_markdown(file_path: str) -> List[Document]:
    """Loads Markdown file as a list of Document objects."""
    try:
        loader = UnstructuredMarkdownLoader(file_path)
        return loader.load()
    except Exception as e:
        print(f"❌ Error loading Markdown file: {e}")
        return []


def split_documents(documents: List[Document], chunk_size: int = 1000, chunk_overlap: int = 200) -> List[Document]:
    """Splits documents for vector search."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap, separators=["\n\n", "\n", " ", ""]
    )
    return text_splitter.split_documents(documents)


def create_vector_store(documents: List[Document]):
    """Creates a vector store using OpenAI embeddings."""
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    return Chroma.from_documents(documents, embeddings)


def create_qa_chain(vector_store):
    """Creates a retrieval-based question-answering chain."""
    llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0, max_tokens=4096, top_p=0.5)
    retriever = vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 10})
    return RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever, return_source_documents=True)


def main():
    """Main function to process trade entry data and generate questions."""
    # ✅ Handle JSON input (from stdin or command-line)
    try:
        if len(sys.argv) > 1:
            trade_data = json.loads(sys.argv[1])  # Read from command-line argument
        else:
            trade_data = json.load(sys.stdin)  # Read from stdin
    except json.JSONDecodeError as e:
        print(f"❌ Error parsing JSON input: {e}")
        sys.exit(1)

    # ✅ Extract `topic_name` safely
    try:
        topic_name = trade_data.get("modules", [{}])[0].get("topics", [{}])[0].get("name", "").strip()
        if not topic_name:
            raise ValueError("Topic name is empty.")
    except Exception as e:
        print(f"❌ Error extracting topic name: {e}")
        sys.exit(1)

    print(f"🟢 Processing topic: {topic_name}")

    try:
        topic_details = fetch_trade_details(topic_name)

        md_path = get_md_file(topic_name)
        if not md_path:
            print(f"❌ No Markdown file found for topic: {topic_name}")
            sys.exit(1)

        print(f"📌 Using Markdown file: {md_path}")

        documents = load_markdown(md_path)
        if not documents:
            print(f"❌ No documents loaded for {md_path}. Exiting.")
            sys.exit(1)

        split_docs = split_documents(documents)
        vector_store = create_vector_store(split_docs)
        qa_chain = create_qa_chain(vector_store)

        all_questions = []
        for level_entry in topic_details["levels"]:
            level_of_question = level_entry.get("level")
            type_of_question = level_entry.get("type")
            num_questions = level_entry.get("numQuestions")

            if num_questions is None:
                print(f"⚠️ Skipping {level_of_question} level (numQuestions not specified).")
                continue

            print(f"🟢 Generating {num_questions} {type_of_question} questions for {level_of_question} level...")

            prompt = f"Generate {num_questions} {type_of_question} questions along with their answers at a {level_of_question} level based on the topic: {documents[0].page_content}"
            response = qa_chain.invoke({"query": prompt})
            result_text = response["result"]

            all_questions.append({
                "level": level_of_question,
                "type": type_of_question,
                "questions": result_text
            })

        with open("output2.json", "w", encoding="utf-8") as json_file:
            json.dump({"questions_and_answers": all_questions}, json_file, indent=4, ensure_ascii=False)

        print(f"✅ Saved {len(all_questions)} questions to output2.json")

    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
