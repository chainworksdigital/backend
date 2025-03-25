import os
import sys
import json
import re
import random
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_community.vectorstores import Chroma
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

def parse_qa_output(result_text, level_of_question, num_options):
    """Parses LLM-generated output and extracts structured MCQ Q&A."""
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

        # Extract MCQ options
        option_pattern = re.compile(r"^\s*[A-Z]\.\s*.+", re.MULTILINE)
        options = [line.strip() for line in lines if option_pattern.match(line)]
        
        # Ensure the number of options matches the requested number
        
        if len(options) > num_options:
            options = options[:num_options]
        elif len(options) < num_options:
            # If fewer options are generated, pad with placeholder options
            for i in range(len(options), num_options):
                options.append(f"{chr(65 + i)}. Placeholder Option")

        # Match the correct answer in MCQ
        answer_match = re.search(r"\*\*Answer:\s*([A-Z])", q, re.IGNORECASE)
        if answer_match:
            correct_option = answer_match.group(1) + "."
            correct_answer = next((opt for opt in options if opt.startswith(correct_option)), None)

        if not question_text or not correct_answer:
            continue  # Skip incomplete or improperly formatted questions

        qa_pairs.append({
            "question": question_text,
            "options": options if options else None,
            "correct_answer": correct_answer,
            "difficulty_level": level_of_question,
            "type": "MCQ"  # Hardcoded to MCQ
        })

    return qa_pairs


def main():
    """Processes trade data and generates MCQ questions dynamically."""
    try:
        trade_data = json.loads(sys.stdin.read())
        topicName = trade_data["modules"][0]["topics"][0]["name"]
        levels = trade_data["modules"][0]["topics"][0]["levels"]

        md_path = f"{MD_FOLDER}/{topicName.replace(' ', '_')}.md"
        # topicName="Safety_Precautions_in_SMAW,_OAW_and_OAGC.md"
        # levels= [
        #     {
        #       "level": "L1",
        #       "numQuestions": 3,
        #       "questions": [],
        #       "type": "MCQ",
        #       "mcqOptions": 6,
        #       "_id": "67de895421162a4f78c122a4"
        #     },
        #     {
        #       "level": "L2",
        #       "numQuestions": 2,
        #       "questions": [],
        #       "type": "MCQ",
        #       "mcqOptions": 6,
        #       "_id": "67de895421162a4f78c122a5"
        #     },
        #     {
        #       "level": "L3",
        #       "numQuestions": 1,
        #       "questions": [],
        #       "type": "MCQ",
        #       "mcqOptions": 6,
        #       "_id": "67de895421162a4f78c122a6"
        #     }
        #   ]
        # md_path  ="/home/uttara/Documents/git/backend/markdown_files/First_Aid.md"
        

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

        # Randomly select a subset of document chunks for variability
        random.shuffle(split_docs)
        selected_chunks = split_docs[:min(5, len(split_docs))]  # Select a random subset of chunks

        vector_store = Chroma.from_documents(selected_chunks, OpenAIEmbeddings(model="text-embedding-3-small"))
        qa_chain = RetrievalQA.from_chain_type(
            llm=ChatOpenAI(model_name="gpt-4o-mini", temperature=0.9, max_tokens=4096),  # Increased temperature for more variability
            chain_type="stuff",
            retriever=vector_store.as_retriever(search_type="similarity", search_kwargs={"k": min(10, len(selected_chunks))}),
            return_source_documents=True
        )

        all_questions = []

        for level in levels:
            original_level = level["level"]
            level_of_question = map_difficulty(original_level)

            num_questions_str = level.get("numQuestions")
            num_questions = int(num_questions_str) if num_questions_str and str(num_questions_str).isdigit() else 0

            if num_questions == 0:
                continue

            # Get the number of MCQ options from the level data
            num_options = int(level.get("mcqOptions", 4))  # Default to 4 if not specified

            # Add more variability to the prompt
            random_element = random.randint(1000, 9999)  # Random number for uniqueness
            random_phrase = random.choice([
                "Ensure the questions are unique and cover different aspects of the topic.",
                "Include questions that test both theoretical and practical knowledge.",
                "Focus on real-world applications and scenarios.",
                "Use diverse phrasing and avoid repetition."
            ])
            prompt_variations = [
                f"Generate {num_questions} multiple-choice questions (MCQs) on {topicName} "
                f"at a {level_of_question} difficulty level. Each question should have {num_options} answer choices "
                f"(A, B, C, D, ...) and clearly indicate the correct answer. {random_phrase} Random element: {random_element}\n\n"
                f"Format:\n1. Question text\nA. Option1\nB. Option2\nC. Option3\nD. Option4\n...\n**Answer: X**",
                f"Create {num_questions} MCQs about {topicName} with a difficulty level of {level_of_question}. "
                f"Ensure each question has {num_options} options (A, B, C, D, ...) and specify the correct answer. {random_phrase} Random element: {random_element}\n\n"
                f"Format:\n1. Question text\nA. Option1\nB. Option2\nC. Option3\nD. Option4\n...\n**Answer: X**",
                f"Write {num_questions} multiple-choice questions on {topicName} at a {level_of_question} difficulty. "
                f"Each question must have {num_options} options (A, B, C, D, ...) and a clearly marked correct answer. {random_phrase} Random element: {random_element}\n\n"
                f"Format:\n1. Question text\nA. Option1\nB. Option2\nC. Option3\nD. Option4\n...\n**Answer: X**"
            ]

            # Randomly select a prompt variation
            prompt = random.choice(prompt_variations)

            response = qa_chain.invoke({"query": prompt})
            result_text = response["result"]

            parsed_questions = parse_qa_output(result_text, level_of_question, num_options)

            # Ensure only the requested number of questions are kept
            if len(parsed_questions) > num_questions:
                parsed_questions = parsed_questions[:num_questions]

            all_questions.extend(parsed_questions)

        valid_questions = [q for q in all_questions if q.get("question") and q.get("correct_answer")]

        # Save output to JSON file
        output_data = {"questions_and_answers": valid_questions}
        with open("output2.json", "w+", encoding="utf-8") as json_file:
            json.dump(output_data, json_file, indent=4, ensure_ascii=False)

        # Print final JSON to be used by other processes
        print(json.dumps(output_data))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        
if __name__ == "__main__":
    main()

    