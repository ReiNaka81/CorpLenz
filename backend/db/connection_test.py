from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

uri = f"mongodb+srv://{DB_USER}:{DB_PASSWORD}@recruit.xqewuj0.mongodb.net/?appName=recruit"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)