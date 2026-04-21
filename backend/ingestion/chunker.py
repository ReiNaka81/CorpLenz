from langchain_text_splitters import RecursiveCharacterTextSplitter


def split_text(sections: list[dict], ticker: str, year: int) -> list[dict]:
    """セクションごとのMarkdownをチャンク化してMongoDBに保存できる形式で返す。

    Args:
        sections: parse_ixbrl() の出力（[{"section": "事業の状況", "markdown": "..."}, ...]）
        ticker: 対象企業の証券コード（例: "7203"）
        year: 対象年度（例: 2024）
    Returns:
        チャンクのリスト（[{"text": "...", "section": "...", "ticker": "...", "year": ...}, ...]）
    """
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = []
    for section in sections:
        texts = text_splitter.split_text(section["markdown"])
        for text in texts:
            chunks.append({
                "text": text,
                "section": section["section"],
                "ticker": ticker,
                "year": year,
            })

    print(f"{len(chunks)}つのチャンクに分割されました。")
    return chunks