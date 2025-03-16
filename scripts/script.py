import os
import sys
import json
import re
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.retrieval_qa.base import RetrievalQA

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("Missing OpenAI API key. Please set it in the environment or .env file.")

MD_FOLDER = "./markdown_files"

def map_difficulty(level):
    """Maps L1, L2, L3 to Easy, Medium, Hard."""
    difficulty_mapping = {
        "L1": "Easy",
        "L2": "Medium",
        "L3": "Hard"
    }
    return difficulty_mapping.get(level, "Medium")  # Default to Medium if unknown

def parse_qa_output(result_text, type_of_question, level_of_question):
    """Parses LLM-generated output and extracts structured Q&A."""
    qa_pairs = []

    # Split the result by question numbering
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
            
            # Match the correct answer in MCQ
            answer_match = re.search(r"\*\*Answer:\s*([A-D])", q, re.IGNORECASE)
            if answer_match:
                correct_option = answer_match.group(1) + "."
                correct_answer = next((opt for opt in options if opt.startswith(correct_option)), None)

        elif type_of_question.lower() == "true/false":
            options = ["A. True", "B. False"]
            
            # Explicit answer matching for True/False
            answer_match = re.search(r"\*\*Answer:\s*([A-B])", q, re.IGNORECASE)
            if answer_match:
                answer_letter = answer_match.group(1).upper()
                correct_answer = "A. True" if answer_letter == "A" else "B. False"
            else:
                # Fallback: Infer from the last line if the answer is mentioned without format
                last_line = lines[-1].lower()
                if "true" in last_line:
                    correct_answer = "A. True"
                elif "false" in last_line:
                    correct_answer = "B. False"

        elif type_of_question.lower() == "subjective":
            match = re.search(r'\*\*Answer\s*\d*:*(.*?)$', q, re.DOTALL)
            correct_answer = match.group(1).strip() if match else "\n".join(lines[1:]).strip()

        if not question_text or not correct_answer:
            continue  # Skip incomplete or improperly formatted questions

        qa_pairs.append({
            "question": question_text,
            "options": options if options else None,
            "correct_answer": correct_answer,
            "difficulty_level": level_of_question,
            "type": type_of_question  # Add the question type here
        })

    return qa_pairs


def main():
    """Processes trade data and generates questions dynamically."""
    try:
        trade_data = json.loads(sys.stdin.read())
        topicName = trade_data["modules"][0]["topics"][0]["name"]
        levels = trade_data["modules"][0]["topics"][0]["levels"]

        md_path = f"{MD_FOLDER}/{topicName.replace(' ', '_')}.md"

        if not os.path.exists(md_path):
            print(json.dumps({"error": f"No Markdown file found for topic: {topicName}"}))
            return

        loader = UnstructuredMarkdownLoader(md_path)
        documents = loader.load()

        if not documents:
            print(json.dumps({"error": "No documents loaded."}))
            return

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        split_docs = text_splitter.split_documents(documents)

        vector_store = Chroma.from_documents(split_docs, OpenAIEmbeddings(model="text-embedding-3-small"))
        qa_chain = RetrievalQA.from_chain_type(
            llm=ChatOpenAI(model_name="gpt-4o-mini", temperature=0, max_tokens=4096),
            chain_type="stuff",
            retriever=vector_store.as_retriever(search_type="similarity", search_kwargs={"k": min(10, len(split_docs))}),
            return_source_documents=True
        )

        all_questions = []

        for level in levels:
            original_level = level["level"]
            level_of_question = map_difficulty(original_level)
            type_of_question = level["type"].lower()

            num_questions_str = level.get("numQuestions")
            num_questions = int(num_questions_str) if num_questions_str and str(num_questions_str).isdigit() else 0

            if num_questions == 0:
                continue

            prompt_formats = {
                "mcq": (
                    f"Generate {num_questions} multiple-choice questions (MCQs) on {topicName} "
                    f"at a {level_of_question} difficulty level. Each question should have four answer choices "
                    f"(A, B, C, D) and clearly indicate the correct answer.\n\n"
                    f"Format:\n1. Question text\nA. Option1\nB. Option2\nC. Option3\nD. Option4\n**Answer: X**"
                ),
                "true/false": (
                    f"Generate {num_questions} True/False questions on {topicName} "
                    f"at a {level_of_question} difficulty level. Each question should have two answer choices "
                    f"(A. True, B. False) and clearly indicate the correct answer.\n\n"
                    f"Format:\n1. Question text\nA. True\nB. False\n**Answer: X**"
                ),
                "subjective": (
                    f"Generate {num_questions} subjective questions along with detailed answers on {topicName} "
                    f"at a {level_of_question} difficulty level. The answers should be comprehensive and informative.\n\n"
                    f"Format:\n1. Question text\n**Answer:** Detailed answer."
                ),
            }

            prompt = prompt_formats.get(type_of_question)

            response = qa_chain.invoke({"query": prompt})
            result_text = response["result"]

            parsed_questions = parse_qa_output(result_text, type_of_question, level_of_question)

            # Ensure only the requested number of questions are kept
            if len(parsed_questions) > num_questions:
                parsed_questions = parsed_questions[:num_questions]

            all_questions.extend(parsed_questions)

        valid_questions = [q for q in all_questions if q.get("question") and q.get("correct_answer")]

        # Save output to JSON file
        output_data = {"questions_and_answers": valid_questions}
        with open("output2.json", "w", encoding="utf-8") as json_file:
            json.dump(output_data, json_file, indent=4, ensure_ascii=False)

        # Print final JSON to be used by other processes
        print(json.dumps(output_data))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main(),