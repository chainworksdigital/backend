import os
import json
import warnings
import re
from dotenv import load_dotenv
import chromadb
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import Chroma
import sys

# Load environment variables
load_dotenv()
warnings.filterwarnings('ignore')

MD_FOLDER = "./markdown_files"

def map_difficulty(level):
    """Maps L1, L2, L3 to Easy, Medium, Hard."""
    return {"L1": "Easy", "L2": "Medium", "L3": "Hard"}.get(level, "Medium")

def parse_qa_output(result_text, type_of_question, level_of_question):
    """Parses LLM-generated output and extracts structured Q&A."""
    qa_pairs = []

    # Split questions using numbering patterns
    questions = re.split(r'\n?\d+\.\s', result_text)
    
    for q in questions:
        lines = q.strip().split("\n")
        if len(lines) < 2:
            continue

        question_text = lines[0].strip()
        options = []
        correct_answer = None

        if type_of_question.lower() == "mcq":
            option_pattern = re.compile(r"^\s*[A-D]\.\s*.+", re.MULTILINE)
            options = [line.strip() for line in lines if option_pattern.match(line)]
            
            # Extract the correct MCQ answer
            answer_match = re.search(r"\*Answer:\s([A-D])", q, re.IGNORECASE)
            if answer_match:
                correct_option = answer_match.group(1) + "."
                correct_answer = next((opt for opt in options if opt.startswith(correct_option)), None)

        elif type_of_question.lower() == "true/false":
            options = ["A. True", "B. False"]
            
            # Extract the correct True/False answer
            answer_match = re.search(r"\*Answer:\s([A-B])", q, re.IGNORECASE)
            if answer_match:
                answer_letter = answer_match.group(1).upper()
                correct_answer = "A. True" if answer_letter == "A" else "B. False"
            else:
                # Fallback: Check the last line for "true" or "false"
                last_line = lines[-1].lower()
                if "true" in last_line:
                    correct_answer = "A. True"
                elif "false" in last_line:
                    correct_answer = "B. False"

        elif type_of_question.lower() == "subjective":
            match = re.search(r'\*Answer:\s(.+)', q, re.DOTALL)
            correct_answer = match.group(1).strip() if match else "\n".join(lines[1:]).strip()

        if not question_text or not correct_answer:
            continue  # Skip incomplete or improperly formatted questions

        qa_pairs.append({
            "question": question_text,
            "options": options if options else None,
            "correct_answer": correct_answer,
            "difficulty_level": level_of_question,
            "type": type_of_question
        })

    return qa_pairs

def split_text(documents):
    """Extract text from documents and split into chunks."""
    raw_texts = [doc.page_content for doc in documents]
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    return text_splitter.split_text("\n".join(raw_texts))

def create_vector_store(chunks):
    """Convert text chunks into embeddings and store them in ChromaDB."""
    try:
        embeddings = OllamaEmbeddings(model="mistral")
        chroma_client = chromadb.PersistentClient(path="./chroma_db")
        vector_store = Chroma.from_texts(chunks, embeddings, client=chroma_client, collection_name="qa_collection")
        return vector_store
    except Exception as e:
        print(f"Error creating ChromaDB vector store: {e}")
        return None

def create_qa_chain(vector_store):
    """Create a question-answering chain using ChromaDB as retriever."""
    try:
        llm = Ollama(model="mistral")  
        retriever = vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 10})
        return RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever, return_source_documents=False)
    except Exception as e:
        print(f"Error creating QA chain: {e}")
        return None

def generate_prompt(type_of_question, topicName, level_of_question, num_questions):
    """Generates structured prompts for different question types."""
    prompt_formats = {
        "mcq": (
            f"Generate {num_questions} multiple-choice questions (MCQs) on {topicName} "
            f"at a {level_of_question} difficulty level. Each question should have four answer choices "
            f"(A, B, C, D) and clearly indicate the correct answer.\n\n"
            f"Format:\n1. Question text\nA. Option1\nB. Option2\nC. Option3\nD. Option4\n*Answer: X*"
        ),
        "true/false": (
            f"Generate {num_questions} True/False questions on {topicName} "
            f"at a {level_of_question} difficulty level. Each question should have two answer choices "
            f"(A. True, B. False) and clearly indicate the correct answer.\n\n"
            f"Format:\n1. Question text\nA. True\nB. False\n*Answer: X*"
        ),
        "subjective": (
            f"Generate {num_questions} subjective questions along with detailed answers on {topicName} "
            f"at a {level_of_question} difficulty level. The answers should be comprehensive and informative.\n\n"
            f"Format:\n1. Question text\n*Answer:* Detailed answer."
        ),
    }
    return prompt_formats.get(type_of_question)

def main():
    """Processes trade data and generates questions dynamically while ensuring the total question limit."""
    try:
        trade_data = json.loads(sys.stdin.read())
        topicName = trade_data["modules"][0]["topics"][0]["name"]
        levels = trade_data["modules"][0]["topics"][0]["levels"]
        total_questions_allowed = trade_data["modules"][0]["topics"][0].get("totalQuestions", 0)
        
        md_path = f"{MD_FOLDER}/{topicName.replace(' ', '_')}.md"
        if not os.path.exists(md_path):
            print(json.dumps({"error": f"No Markdown file found for topic: {topicName}"}))
            return

        loader = UnstructuredMarkdownLoader(md_path)
        documents = loader.load()
        if not documents:
            print(json.dumps({"error": "No documents loaded."}))
            return

        chunks = split_text(documents)
        vector_store = create_vector_store(chunks)
        if not vector_store:
            return

        qa_chain = create_qa_chain(vector_store)
        if not qa_chain:
            return

        all_questions = []
        remaining_questions = total_questions_allowed

        for level in levels:
            if remaining_questions <= 0:
                break  

            original_level = level["level"]
            level_of_question = map_difficulty(original_level)
            type_of_question = level.get("type", "").strip().lower()
            num_questions = min(int(level.get("numQuestions", 0)), remaining_questions)

            if num_questions == 0:
                continue

            prompt = generate_prompt(type_of_question, topicName, level_of_question, num_questions)
            response = qa_chain.invoke({"query": prompt})
            result_text = response["result"]
            
            parsed_questions = parse_qa_output(result_text, type_of_question, level_of_question)
            
            all_questions.extend(parsed_questions[:remaining_questions])
            remaining_questions -= len(parsed_questions[:remaining_questions])

        valid_questions = [q for q in all_questions if q.get("question") and q.get("correct_answer")]

        output_data = {"questions_and_answers": valid_questions}
        with open("output2.json", "w", encoding="utf-8") as json_file:
            json.dump(output_data, json_file, indent=4, ensure_ascii=False)

        print(json.dumps(output_data))
    
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
