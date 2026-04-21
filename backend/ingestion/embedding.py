import os
from dotenv import load_dotenv
import voyageai

load_dotenv()

VOYAGE_API_KEY = os.getenv("VOYAGE_API_KEY")
EMBEDDING_MODEL = "voyage-finance-2"

def get_voyage_client():
    return voyageai.Client()

def get_embedding(data, input_type="document"):
    voyage = get_voyage_client()
    embeddings = voyage.embed(
        [data], model=EMBEDDING_MODEL, input_type=input_type
    ).embeddings
    return embeddings[0]
