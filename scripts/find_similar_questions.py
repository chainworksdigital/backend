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

def get_embedding(text_to_embed):
    chunk_size = 8000
    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(model_name="text-embedding-3-small", chunk_size=chunk_size, chunk_overlap=0)
    result = text_splitter.split_text(text_to_embed)
    text = result[0].replace("\n", " ")
    try:
        return clientOpenAI.embeddings.create(input=[text], model="text-embedding-3-small").data[0].embedding
    except Exception as e:
        print(f"OpenAI API Error: {e}")
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
                    sim_ques = None
                    for d in questions_list[index]["ques"]:
                        if d.get("language") == language:
                            sim_ques = d
                            break
                    if sim_ques:
                        if language in similar_questions:
                            similar_questions[language].append({
                                "simQuesId": questions_list[index]["_id"],
                                "simQues": sim_ques["is"],
                                "simScore": sim_score
                            })
                        else:
                            similar_questions[language] = [{
                                "simQuesId": questions_list[index]["_id"],
                                "simQues": sim_ques["is"],
                                "simScore": sim_score
                            }]
    
    return {"similarQuestions": similar_questions, "newVector": new_question_embedding}