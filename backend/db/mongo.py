import os
from pymongo import MongoClient

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

uri = f"mongodb+srv://{DB_USER}:{DB_PASSWORD}@recruit.xqewuj0.mongodb.net/?appName=recruit"

def get_collection(collection_name: str = "chunks"):
    client = MongoClient(uri)
    return client["rag_db"][collection_name]
