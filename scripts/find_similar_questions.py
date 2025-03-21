import json
import numpy as np
from pymongo import MongoClient
from sklearn.metrics.pairwise import cosine_similarity
from langchain.text_splitter import RecursiveCharacterTextSplitter
from openai import OpenAI
import os
import sys
from dotenv import load_dotenv

load_dotenv()

# Initialize OpenAI client
client_openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# MongoDB connection
def get_db_client():
    try:
        client = MongoClient(os.getenv("MONGO_URI"))
        db = client["questionGenerator"]
        print("✅ Connected to MongoDB")
        return db
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}", file=sys.stderr)
        raise

# Generate embeddings
def get_embedding(text):
    try:
        text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            model_name="text-embedding-3-small", chunk_size=8000, chunk_overlap=0
        )
        chunks = text_splitter.split_text(text)
        embedding = client_openai.embeddings.create(input=[chunks[0].replace("\n", " ")], model="text-embedding-3-small").data[0].embedding
        return np.array(embedding)
    except Exception as e:
        print(f"❌ Error generating embedding: {e}", file=sys.stderr)
        return np.zeros(1536)

# Find similar questions
def get_similar_questions(new_question, threshold=0.7):
    try:
        db = get_db_client()
        question_model = db["nimiquestions"]
        questions_list = list(question_model.find())

        question_vectors = {}
        embedding_vector_length = 1536

        # Extract embeddings from the database
        for question in questions_list:
            for ques_lang_obj in question.get("ques", []):
                vector = np.array(ques_lang_obj.get("vector", np.zeros(embedding_vector_length)))
                language = ques_lang_obj.get("language", "unknown")
                if language in question_vectors:
                    question_vectors[language].append(vector)
                else:
                    question_vectors[language] = [vector]

        similar_questions = {}
        new_question_embedding = {}

        # Process new question
        for question_lang_obj in new_question:
            language = question_lang_obj.get("language", "unknown")
            new_question_vector = get_embedding(question_lang_obj.get("is", ""))
            new_question_embedding[language] = new_question_vector

            if language in question_vectors and len(question_vectors[language]) > 0:
                embedding_matrix = np.vstack(question_vectors[language])
                new_question_embedding_reshaped = new_question_vector.reshape(1, -1)
                similarity_scores = cosine_similarity(new_question_embedding_reshaped, embedding_matrix)[0]

                for index, sim_score in enumerate(similarity_scores):
                    if sim_score >= threshold:
                        sim_ques = next((d for d in questions_list[index].get("ques", []) if d.get("language") == language), None)
                        if sim_ques:
                            if language in similar_questions:
                                similar_questions[language].append({
                                    "simQuesId": str(questions_list[index]["_id"]),
                                    "simQues": sim_ques["is"],
                                    "simScore": sim_score
                                })
                            else:
                                similar_questions[language] = [{
                                    "simQuesId": str(questions_list[index]["_id"]),
                                    "simQues": sim_ques["is"],
                                    "simScore": sim_score
                                }]

        print("✅ Similarity check completed")
        return {"similarQuestions": similar_questions, "newVector": new_question_embedding}
    except Exception as e:
        print(f"❌ Error in get_similar_questions: {e}")
        return {"error": str(e)}

# Main execution
if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        result = get_similar_questions(input_data)
        print(json.dumps(result))
    except Exception as e:
        print(f"❌ Script execution failed: {e}")
        print(json.dumps({"error": str(e)}))