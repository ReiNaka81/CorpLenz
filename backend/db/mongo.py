import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")

def get_collection(collection_name: str = "chunks"):
    client = MongoClient(MONGO_URI)
    return client["rag_db"][collection_name]
