from pathlib import Path
from ingestion.html_parser import parse_ixbrl
from ingestion.chunker import split_text
from ingestion.embedding import insert_chunks
from ingestion.xbrl_parser import parse_xbrl
from db.mongo import create_vector_index


def ingest(zip_path: str | Path, ticker: str, year: int) -> None:
    """XBRL ZIPを取り込み、チャンク化・財務数値をMongoDBに保存する。

    Args:
        zip_path: XBRL ZIPファイルのパス
        ticker: 対象企業の証券コード（例: "7203"）
        year: 対象年度（例: 2024）
    """
    sections = parse_ixbrl(zip_path)
    chunks = split_text(sections, ticker, year)
    insert_chunks(chunks)
    create_vector_index("chunks")
    parse_xbrl(zip_path, ticker, year)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--zip", required=True, help="XBRL ZIPファイルのパス")
    parser.add_argument("--ticker", required=True, help="証券コード（例: 7203）")
    parser.add_argument("--year", type=int, required=True, help="対象年度（例: 2024）")
    args = parser.parse_args()

    ingest(args.zip, args.ticker, args.year)
