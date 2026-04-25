import os
import time
from datetime import datetime, timezone
from pymongo import MongoClient
from pymongo.operations import SearchIndexModel
from models.models import CompanySummary

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
INDEX_CREATION_TIMEOUT = 300

uri = f"mongodb+srv://{DB_USER}:{DB_PASSWORD}@recruit.xqewuj0.mongodb.net/?appName=recruit"

def get_collection(collection_name: str = "chunks"):
    client = MongoClient(uri)
    return client["rag_db"][collection_name]


_VECTOR_INDEX_DEFINITION = {
    "fields": [
        {
            "type": "vector",
            "numDimensions": 1024,
            "path": "embedding",
            "similarity": "dotProduct",
        },
        {
            "type": "filter",
            "path": "ticker",
        },
    ]
}


def create_vector_index(collection_name: str):
    """MongoDB Atlas に vector search index を作成し、queryable になるまで待機する。

    ticker フィルターを含む正しい定義のインデックスが queryable な場合は何もしない。
    定義が古い場合は削除して再作成する。
    INDEX_CREATION_TIMEOUT 秒以内に queryable にならない場合は TimeoutError を送出する。
    """
    collection = get_collection(collection_name)

    existing_indexes = list(collection.list_search_indexes("vector_index"))
    if existing_indexes:
        existing = existing_indexes[0]
        fields = existing.get("latestDefinition", {}).get("fields", [])
        has_ticker_filter = any(f.get("type") == "filter" and f.get("path") == "ticker" for f in fields)
        if existing.get("queryable") and has_ticker_filter:
            return
        print("vector_index を再作成中...")
        collection.drop_search_index("vector_index")
        while list(collection.list_search_indexes("vector_index")):
            time.sleep(2)

    print("vector_index を作成中...")
    search_index_model = SearchIndexModel(
        definition=_VECTOR_INDEX_DEFINITION,
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


def upsert_company(ticker: str, name: str, summary: CompanySummary) -> None:
    """companiesコレクションに企業サマリーをupsertする。

    Args:
        ticker: 証券コード（例: "7203"）
        name: 会社名（EDINETのfilerNameから取得）
        summary: generate_summary()の出力
    """
    collection = get_collection("companies")
    collection.update_one(
        {"ticker": ticker},
        {"$set": {"ticker": ticker, "name": name, "summary": summary.model_dump(), "updated_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    print("サマリーをDBに保存しました。")