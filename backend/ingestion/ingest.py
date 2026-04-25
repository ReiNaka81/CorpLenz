from ingestion.edinet import fetch_company_report
from ingestion.html_parser import parse_ixbrl
from ingestion.chunker import split_text
from ingestion.embedding import insert_chunks
from ingestion.xbrl_parser import parse_xbrl
from ingestion.summarizer import generate_summary
from db.mongo import create_vector_index
from db.mongo import upsert_company


def ingest(ticker: str, year: int) -> None:
    """EDINETからダウンロードしてチャンク化・財務数値・企業サマリーをMongoDBに保存する。

    Args:
        ticker: 対象企業の証券コード（例: "7203"）
        year: 対象年度（例: 2024）
    """
    result = fetch_company_report(ticker, year)
    zip_path = result["zip_path"]
    name = result["company_name"]

    sections = parse_ixbrl(zip_path)
    chunks = split_text(sections, ticker, year)
    insert_chunks(chunks)
    create_vector_index("chunks")
    parse_xbrl(zip_path, ticker, year)
    summary = generate_summary(sections)
    upsert_company(ticker, name, summary)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--ticker", required=True, help="証券コード（例: 7203）")
    parser.add_argument("--year", type=int, required=True, help="対象年度（例: 2024）")
    args = parser.parse_args()

    ingest(args.ticker, args.year)
