import json
import sys
import logging
import numpy as np
from pymongo import MongoClient
from sklearn.metrics.pairwise import cosine_similarity
from openai import OpenAI
from dotenv import load_dotenv
import os

# ✅ Load environment variables
load_dotenv()

# ✅ Logging setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# ✅ OpenAI Client Setup
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    logging.error("❌ Missing OpenAI API Key. Check environment variables.")
    sys.exit(1)

clientOpenAI = OpenAI(api_key=openai_api_key)

# ✅ MongoDB Setup
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    logging.error("❌ Missing MongoDB URI. Check environment variables.")
    sys.exit(1)

client = MongoClient(mongo_uri)
db = client["questionGenerator"]
nimi_collection = db["nimiquestions"]  # ✅ Collection Name

# ✅ Function to Generate Embedding
def get_embedding(text_to_embed):
    try:
        response = clientOpenAI.embeddings.create(input=[text_to_embed], model="text-embedding-3-small")
        embedding = response.data[0].embedding

        if not embedding:
            raise ValueError("Received empty embedding from OpenAI.")

        logging.info(f"✅ Embedding generated for text: {text_to_embed[:50]}...")  # Log first 50 chars
        return embedding
    except Exception as e:
        logging.error(f"❌ OpenAI API Error: {e}")
        return np.zeros(1536)  # Return zero vector to avoid crashes

# ✅ Function to Get Similar Questions
def get_similar_questions(question_text, threshold=0.7):
    try:
        # ✅ Fetch all questions from DB
        questions_list = []
        for doc in nimi_collection.find():
            for module in doc.get("modules", []):
                for topic in module.get("topics", []):
                    for level in topic.get("levels", []):
                        for qna in level.get("questions", []):  # 🔥 FIXED: Use "questions" instead of "questions_and_answers"
                            question_text_in_db = qna.get("question", "").strip()
                            if question_text_in_db:
                                questions_list.append({
                                    "text": question_text_in_db,
                                    "id": str(qna.get("_id"))
                                })

        if not questions_list:
            logging.warning("⚠️ No questions found in MongoDB.")
            return {"similarQuestions": [], "newVector": []}

        logging.info(f"✅ Total {len(questions_list)} questions retrieved from MongoDB.")

        # ✅ Generate embedding for the new question
        new_question_embedding = get_embedding(question_text)
        new_question_vector = np.array(new_question_embedding)

        # ✅ Compare with stored questions
        similar_questions = []
        for q in questions_list:
            stored_embedding = get_embedding(q["text"])  # 🔥 Generate embedding dynamically
            stored_vector = np.array(stored_embedding)

            if np.all(stored_vector == 0):  # Skip if embedding failed
                continue

            sim_score = cosine_similarity(new_question_vector.reshape(1, -1), stored_vector.reshape(1, -1))[0][0]

            if sim_score >= threshold:
                similar_questions.append({
                    "simQuesId": q["id"],
                    "simQues": q["text"],
                    "simScore": round(sim_score, 4)  # Round for better readability
                })

        logging.info(f"✅ Found {len(similar_questions)} similar questions.")

        return {
            "inputQuestion": question_text,
            "similarQuestions": similar_questions,  # ✅ List of similar questions
            "newVector": new_question_embedding  # ✅ Ensure it's serializable
        }

    except Exception as e:
        logging.error(f"❌ Error in get_similar_questions: {e}")
        return {"error": str(e)}

# ✅ Main Execution
if __name__ == "__main__":
    try:
        # ✅ Read input data and validate format
        input_data = json.loads(sys.argv[1])
        logging.info(f"📥 Received input: {input_data}")

        if isinstance(input_data, dict) and "question" in input_data:
            question_text = input_data["question"]
        else:
            raise ValueError("Invalid input format. Expected {'question': '...'}")

        # ✅ Run Similarity Check
        result = get_similar_questions(question_text)

        # ✅ Output JSON response
        print(json.dumps(result))

    except json.JSONDecodeError as e:
        logging.error(f"❌ Invalid JSON input: {e}")
        print(json.dumps({"error": f"Invalid JSON input: {e}"}))
        sys.exit(1)

    except Exception as e:
        logging.error(f"❌ Script execution failed: {e}")
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
