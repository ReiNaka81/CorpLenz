import re
import zipfile
from pathlib import Path

from bs4 import BeautifulSoup
from markdownify import markdownify


# 本文ファイルのプレフィックス（ヘッダー・監査報告書は除外）
_HONBUN_PREFIX = "honbun"


def _extract_section_title(filename: str) -> str:
    """ファイル名から番号を取り出してセクション識別子にする（例: 0101010）"""
    match = re.search(r"(\d{7})_honbun", filename)
    return match.group(1) if match else filename


def _clean_ixbrl(html: str) -> str:
    """iXBRLのXBRL固有タグを除去してプレーンなHTMLにする"""
    soup = BeautifulSoup(html, "html.parser")

    # ix:* タグはテキストを保持しつつタグだけ除去
    for tag in soup.find_all(re.compile(r"^ix:")):
        tag.unwrap()

    # <head> を除去（CSS・メタ情報は不要）
    if soup.head:
        soup.head.decompose()

    # XBRL名前空間属性を除去
    for tag in soup.find_all(True):
        attrs_to_remove = [k for k in tag.attrs if ":" in k]
        for attr in attrs_to_remove:
            del tag[attr]

    body = soup.body
    return str(body) if body else str(soup)


def _html_to_markdown(html: str) -> str:
    """HTMLをMarkdownに変換する"""
    md = markdownify(html, heading_style="ATX", bullets="-")
    # 3行以上の連続空行を2行に圧縮
    md = re.sub(r"\n{3,}", "\n\n", md)
    return md.strip()


def parse_ixbrl(xbrl_zip_path: str | Path) -> list[dict]:
    """
    XBRL ZIPからiXBRL本文ファイルを読み込み、セクションごとのMarkdownを返す

    Returns:
        [{"section": "0101010", "markdown": "..."}, ...]
    """
    results = []

    with zipfile.ZipFile(xbrl_zip_path, "r") as z:
        honbun_files = sorted(
            f for f in z.namelist()
            if _HONBUN_PREFIX in Path(f).name and f.endswith("ixbrl.htm")
        )
        for htm_file in honbun_files:
            html = z.read(htm_file).decode("utf-8", errors="ignore")
            clean_html = _clean_ixbrl(html)
            markdown = _html_to_markdown(clean_html)

            if markdown:
                results.append({
                    "section": _extract_section_title(htm_file),
                    "markdown": markdown,
                })

    return results


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--company", required=True, help="会社名の一部（例: 日立）")
    parser.add_argument("--year",    type=int, required=True, help="対象年度（例: 2025）")
    parser.add_argument("--section", help="特定セクションのみ表示（例: 0101010）")
    args = parser.parse_args()

    data_dir = Path(__file__).parent.parent / "data"
    zip_files = list(data_dir.glob(f"*{args.company}*/{args.year}/*_xbrl.zip"))
    if not zip_files:
        print(f"[error] ZIPが見つかりません")
        exit(1)

    sections = parse_ixbrl(zip_files[0])

    if args.section:
        sections = [s for s in sections if s["section"] == args.section]

    for s in sections:
        print(f"\n{'='*60}")
        print(f"section: {s['section']}")
        print(f"{'='*60}")
        print(s["markdown"])
