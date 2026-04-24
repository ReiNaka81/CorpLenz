import os
import time
from pymongo import MongoClient
from pymongo.operations import SearchIndexModel

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
INDEX_CREATION_TIMEOUT = 300

uri = f"mongodb+srv://{DB_USER}:{DB_PASSWORD}@recruit.xqewuj0.mongodb.net/?appName=recruit"

def get_collection(collection_name: str = "chunks"):
    client = MongoClient(uri)
    return client["rag_db"][collection_name]


def create_vector_index(collection_name: str):
    """MongoDB Atlas に vector search index を作成し、queryable になるまで待機する。

    index が既に queryable な場合は何もしない。
    INDEX_CREATION_TIMEOUT 秒以内に queryable にならない場合は TimeoutError を送出する。
    """
    collection = get_collection(collection_name)

    existing_indexes = list(collection.list_search_indexes("vector_index"))
    if existing_indexes and existing_indexes[0].get("queryable"):
        return

    if not existing_indexes:
        print("indexを作成中...")
        search_index_model = SearchIndexModel(
            definition={
                "fields": [
                    {
                        "type": "vector",
                        "numDimensions": 1024,
                        "path": "embedding",
                        "similarity": "dotProduct",
                    }
                ]
            },
            name="vector_index",
            type="vectorSearch",
        )
        collection.create_search_index(model=search_index_model)

    deadline = time.time() + INDEX_CREATION_TIMEOUT
    while time.time() < deadline:
        indices = list(collection.list_search_indexes("vector_index"))
        if indices and indices[0].get("queryable"):
            print("vector_index でクエリ可能")
            return
        time.sleep(5)

    raise TimeoutError(f"vector indexが {INDEX_CREATION_TIMEOUT}秒以内に queryable にならなかった")