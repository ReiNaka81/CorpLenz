import os
from dotenv import load_dotenv
import voyageai
from rag.retriever import get_collection

load_dotenv()

VOYAGE_API_KEY = os.getenv("VOYAGE_API_KEY")
EMBEDDING_MODEL = "voyage-finance-2"
MONGO_URI = os.getenv("MONGO_URI")

def get_voyage_client():
    return voyageai.Client()

def get_embedding(data, input_type="document"):
    voyage = get_voyage_client()
    embeddings = voyage.embed(
        [data], model=EMBEDDING_MODEL, input_type=input_type
    ).embeddings
    return embeddings[0]

def insert_chunks(chunks: list[dict], collection_name: str = "chunks") -> None:
    """チャンクをベクトル化してMongoDBに保存する。

    Args:
        chunks: chunker.split_text() の出力（[{"text": "...", "section": "...", "ticker": "...", "year": ...}, ...]）
        collection_name: 保存先コレクション名。"chunks" または "summaries"
    """
    collection = get_collection(collection_name)
    docs = []
    for chunk in chunks:
        docs.append({
            "text": chunk["text"],
            "section": chunk["section"],
            "ticker": chunk["ticker"],
            "year": chunk["year"],
            "embedding": get_embedding(chunk["text"]),
        })
    collection.insert_many(docs)
    print(f"{len(docs)}件を {collection_name} に保存しました。")