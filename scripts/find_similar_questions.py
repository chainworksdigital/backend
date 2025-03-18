import json
import logging
import numpy as np
from pymongo import MongoClient
from bson import ObjectId
import os
from sklearn.metrics.pairwise import cosine_similarity
from langchain.text_splitter import RecursiveCharacterTextSplitter
from openai import OpenAI

clientOpenAI = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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

def get_similar_questions(creator_id, new_question, threshold):
    client = MongoClient(os.getenv("DB"))
    test_db = client[os.getenv("TEST_DB_NAME")]
    question_model = test_db["questions"]
    questions_list = list(question_model.find({"creator": ObjectId(creator_id)}))
    
    question_vectors = {}  # Initialize empty dictionary
    embedding_vector_length = 1536

    # Store existing questions' embeddings per language
    for question in questions_list:
        for ques_lang_obj in question["ques"]:
            vector_to_append = np.array(ques_lang_obj["vector"]) if ques_lang_obj["vector"] else np.zeros(embedding_vector_length)
            if ques_lang_obj["language"] in question_vectors:
                question_vectors[ques_lang_obj["language"]].append(vector_to_append)
            else:
                question_vectors[ques_lang_obj["language"]] = [vector_to_append]

    similar_questions = {}
    new_question_embedding = {}  # Store all language embeddings

    for question_lang_obj in new_question:
        language = question_lang_obj["language"]
        new_question_vector = np.zeros(embedding_vector_length)  # Default zero vector

        if question_lang_obj.get("is"):
            new_question_vector = np.array(get_embedding(question_lang_obj["is"]))  # Generate embedding

        # Store the correct embedding per language
        new_question_embedding[language] = new_question_vector  

        # Compute similarity if there are existing questions in that language
        if language in question_vectors and len(question_vectors[language]) > 0:
            embedding_matrix = np.vstack(question_vectors[language])
            new_question_embedding_reshaped = new_question_vector.reshape(1, -1)  # Convert to 2D array
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