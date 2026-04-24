from ingestion.embedding import get_embedding
from db.mongo import get_collection

NUM_CANDIDATES = 100

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
                "index": "vector_index",
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
