import time
from pymongo.operations import SearchIndexModel
from ingestion.embedding import get_embedding
from db.mongo import get_collection

INDEX_NAME = "vector_index"
INDEX_CREATION_TIMEOUT = 300
NUM_CANDIDATES = 100

def create_vector_index():
    """MongoDB Atlas に vector search index を作成し、queryable になるまで待機する。

    index が既に queryable な場合は何もしない。
    INDEX_CREATION_TIMEOUT 秒以内に queryable にならない場合は TimeoutError を送出する。
    """
    collection = get_collection()

    existing_indexes = list(collection.list_search_indexes(INDEX_NAME))
    if existing_indexes and existing_indexes[0].get("queryable"):
        return

    if not existing_indexes:
        print("vector search indexを作成中...")
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
            name=INDEX_NAME,
            type="vectorSearch",
        )
        collection.create_search_index(model=search_index_model)

    deadline = time.time() + INDEX_CREATION_TIMEOUT
    while time.time() < deadline:
        indices = list(collection.list_search_indexes(INDEX_NAME))
        if indices and indices[0].get("queryable"):
            print(f"{INDEX_NAME} でクエリ可能")
            return
        time.sleep(5)

    raise TimeoutError(f"vector index '{INDEX_NAME}' が {INDEX_CREATION_TIMEOUT}秒以内に queryable にならなかった")


def retrieve(query: str, ticker: str, top_k: int = 5) -> list[dict]:
    """クエリに意味的に近いチャンクを MongoDB vector search で取得する。

    Args:
        query: ユーザーの検索クエリ
        ticker: 対象企業の証券コード（例: "7203"）
        top_k: 取得件数
    Returns:
        チャンクのリスト（text, section, year を含む）
    """

    # 質問をベクトル化（チャンクのベクトルと同じ空間に変換することで意味的な近さで検索できる）
    query_embedding = get_embedding(query, input_type="query")
    pipeline = [
        # ステップ1: クエリのベクトルに意味的に近いチャンクを ticker で絞りながら top_k 件取得
        {
            "$vectorSearch": {
                "index": INDEX_NAME,
                "queryVector": query_embedding,
                "path": "embedding",
                "numCandidates": NUM_CANDIDATES,
                "limit": top_k,
                "filter": {"ticker": ticker},
            }
        },
        # ステップ2: 必要なフィールドだけに絞って返す
        {
            "$project": {
                "_id": 0,
                "text": 1,
                "section": 1,
                "year": 1,
            }
        },
    ]

    # mongoDBにjobを投げる
    collection = get_collection()
    return list(collection.aggregate(pipeline))



if __name__ == "__main__":
    import pprint
    ticker = input("ticker: ").strip()
    query = input("query: ").strip()
    results = retrieve(query, ticker)
    pprint.pprint(results)
