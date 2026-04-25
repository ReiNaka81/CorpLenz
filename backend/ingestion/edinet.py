import os
import requests
from datetime import datetime, timedelta
from pathlib import Path
import time
from ingestion.maps import INDUSTRY_MAP

EDINET_API_KEY = os.getenv("EDINET_API_KEY")
BASE_URL = "https://api.edinet-fsa.go.jp//api/v2"
SAVE_DIR = Path(__file__).parent.parent / "data"    # backend/dataを指定


def _get_documents_by_date(date: str) -> list[dict]:
    """指定日の提出書類一覧を取得"""
    url = f"{BASE_URL}/documents.json"
    params = {
        "date": date,
        "type": 2,
        "Subscription-Key": EDINET_API_KEY,
    }
    res = requests.get(url, params=params)
    res.raise_for_status()  # エラー処理
    return res.json().get("results", [])    # "results"キーを抽出


def _find_annual_report(sec_code: str, start_date: str, end_date: str) -> dict | None:
    """指定期間内の有価証券報告書を検索してdocIDを返す"""
    current = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")

    while current <= end:
        date_str = current.strftime("%Y-%m-%d")
        docs = _get_documents_by_date(date_str)

        for doc in docs:
            if (
                doc.get("secCode") == sec_code
                and doc.get("formCode") == "030000"  # 有価証券報告書
            ):
                return doc

        current += timedelta(days=1)    # 日付を一日進める
        time.sleep(0.5)  # API負荷軽減

    return None


def _download_file(doc_id: str, file_type: int, save_path: Path) -> Path:
    """EDINET書類取得APIからファイルをダウンロード"""
    url = f"{BASE_URL}/documents/{doc_id}"
    params = {
        "type": file_type,
        "Subscription-Key": EDINET_API_KEY,
    }
    res = requests.get(url, params=params)
    res.raise_for_status()
    save_path.write_bytes(res.content)
    return save_path


def fetch_company_report(ticker: str, year: int) -> dict:
    """
    指定企業の有価証券報告書PDFとXBRLを取得してローカルに保存する

    Args:
        sec_code: 証券コード4桁（例: "7203"）
        year: 対象年度（例: 2024）

    Returns:
        company_name: 会社名
        zip_path: xbrl.zipの保存先
    """
    # EDINETの証券コードは5桁（末尾に0を付加）
    edinet_sec_code = ticker + "0"

    # 有価証券報告書の提出期間（対象年度の4月〜翌年3月）
    start_date = f"{year}-04-01"
    end_date = f"{year + 1}-03-31"

    print(f"有価証券報告書を検索中... ({start_date} ~ {end_date})")
    doc = _find_annual_report(edinet_sec_code, start_date, end_date)

    if not doc:
        raise ValueError(f"有価証券報告書が見つかりませんでした: secCode={ticker}, year={year}")

    doc_id = doc["docID"]
    company_name = doc["filerName"]
    sector_code = doc.get("industryCode", "")
    sector = INDUSTRY_MAP.get(sector_code, "その他")

    print(f"書類発見: 会社名 = {company_name}, 提出日 = {doc.get('submitDateTime', '')}")

    save_dir = SAVE_DIR / company_name / str(year)
    save_dir.mkdir(parents=True, exist_ok=True)

    print(f"PDFをダウンロード中...")
    _download_file(doc_id, file_type=2, save_path=save_dir / f"{company_name}.pdf")

    print(f"XBRLをダウンロード中...")
    xbrl_path = _download_file(doc_id, file_type=1, save_path=save_dir / f"{company_name}_xbrl.zip")

    print(f"{company_name}のXBRLとPDFの保存が完了しました。")

    return {
        "company_name": company_name,
        "zip_path": xbrl_path,
        "sector": sector,
    }


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--ticker", required=True, help="証券コード（例: 7203）")
    parser.add_argument("--year", type=int, required=True, help="対象年度（例: 2024）")
    args = parser.parse_args()

    fetch_company_report(args.ticker, args.year)
