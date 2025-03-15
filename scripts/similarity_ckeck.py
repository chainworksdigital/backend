import os
import sys
import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from bson import ObjectId

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

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

def getSimilarQuestions(creatorId, newQuestion, threshold):
    client = MongoClient(os.getenv("DB"))
    testDB = client[os.getenv("TEST_DB_NAME")]
    questionModel = testDB["questions"]
    questionsList = list(questionModel.find({"creator": ObjectId(creatorId)}))

    questionVectors = {}
    embeddingVectorLength = 1536

    for question in questionsList:
        for quesLangObj in question["ques"]:
            vectorToAppend = np.array(quesLangObj["vector"]) if quesLangObj["vector"] else np.zeros(embeddingVectorLength)
            if quesLangObj["language"] in questionVectors:
                questionVectors[quesLangObj["language"]].append(vectorToAppend)
            else:
                questionVectors[quesLangObj["language"]] = [vectorToAppend]

    similarQuestions = {}
    new_question_embedding = {}

    for questionLangObj in newQuestion:
        language = questionLangObj["language"]
        new_question_vector = np.zeros(embeddingVectorLength)

        if questionLangObj.get("is"):
            new_question_vector = np.array(get_embedding(questionLangObj["is"]))

        new_question_embedding[language] = new_question_vector

        if language in questionVectors and len(questionVectors[language]) > 0:
            embedding_matrix = np.vstack(questionVectors[language])
            new_question_embedding_reshaped = new_question_vector.reshape(1, -1)
            similarity_scores = cosine_similarity(new_question_embedding_reshaped, embedding_matrix)[0]

            for index, simScore in enumerate(similarity_scores):
                if simScore >= threshold:
                    simQues = None
                    for d in questionsList[index]["ques"]:
                        if d.get("language") == language:
                            simQues = d
                            break
                    if simQues:
                        if language in similarQuestions:
                            similarQuestions[language].append({
                                "simQuesId": questionsList[index]["_id"],
                                "simQues": simQues["is"],
                                "simScore": simScore
                            })
                        else:
                            similarQuestions[language] = [{
                                "simQuesId": questionsList[index]["_id"],
                                "simQues": simQues["is"],
                                "simScore": simScore
                            }]

    return {"similarQuestions": similarQuestions, "newVector": new_question_embedding}

if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())
    creatorId = input_data["creatorId"]
    newQuestion = input_data["newQuestion"]
    threshold = input_data["threshold"]

    result = getSimilarQuestions(creatorId, newQuestion, threshold)
    print(json.dumps(result))