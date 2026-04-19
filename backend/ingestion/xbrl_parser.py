import zipfile
import re
from pathlib import Path


# 抽出対象タグのキーワードと対応する項目名
# IFRS・J-GAAP共通で取得可能な項目のみ定義（営業利益はIFRSで標準タグなし）
# キーワードは優先順に並べる（先頭ほど優先）
METRIC_KEYWORDS = {
    # 売上収益 / 売上高
    "revenue":       ["NetSales", "Revenue", "OperatingRevenues"],

    # 税引前利益（IFRS）/ 税引前当期純利益（J-GAAP）
    "pretax_profit": ["ProfitLossBeforeTax", "OrdinaryIncome"],

    # 親会社帰属純利益
    "net_profit":    ["ProfitLossAttributableToOwnersOfParent", "NetIncome"],

    # 総資産
    "total_assets":  ["Assets"],

    # 親会社株主持分 / 純資産
    "equity":        ["EquityAttributableToOwnersOfParent", "NetAssets", "Equity"],
}

# 会計基準の判定：主要収益タグの有無で判断（単なるIFRS文字列検索より確実）
_IFRS_REVENUE_TAG  = "RevenueIFRSSummaryOfBusinessResults"
_JGAAP_REVENUE_TAG = "NetSalesSummaryOfBusinessResults"

# 取得する年度のコンテキスト（当期 + 過去4年 = 5年分）
YEAR_CONTEXTS = {
    0: ("CurrentYearDuration",  "CurrentYearInstant"),
    1: ("Prior1YearDuration",   "Prior1YearInstant"),
    2: ("Prior2YearDuration",   "Prior2YearInstant"),
    3: ("Prior3YearDuration",   "Prior3YearInstant"),
    4: ("Prior4YearDuration",   "Prior4YearInstant"),
}


def _extract_nonfractions(htm_content: str) -> list[dict]:
    """iXBRLファイルからix:nonFraction要素を全て抽出する"""
    blocks = re.findall(
        r'<ix:nonFraction([^>]+)>([\s\S]*?)</ix:nonFraction>',
        htm_content
    )
    results = []
    for attrs, raw_val in blocks:
        name  = re.search(r'name="([^"]+)"', attrs)
        ctx   = re.search(r'contextRef="([^"]+)"', attrs)
        scale = re.search(r'scale="([^"]+)"', attrs)
        sign  = re.search(r'sign="([^"]+)"', attrs)

        if not name or not ctx:
            continue

        clean = raw_val.replace(",", "").strip()
        try:
            value = float(clean)
        except ValueError:
            continue

        # scale属性で単位変換（scale=6 → 百万円 → 実際の値に戻す）
        if scale:
            value *= 10 ** int(scale.group(1))

        # sign="-" は負の値
        if sign and sign.group(1) == "-":
            value *= -1

        results.append({
            "name":    name.group(1),
            "context": ctx.group(1),
            "value":   int(value),
        })
    return results


def _match_metric(tag_name: str, keywords: list[str]) -> bool:
    """タグ名がキーワードのいずれかを含むか確認する"""
    local_name = tag_name.split(":")[-1]  # namespace prefix を除去
    return any(kw in local_name for kw in keywords)


def _keyword_priority(tag_name: str, keywords: list[str]) -> int:
    """キーワードリスト内での優先度（低いほど高優先）"""
    local_name = tag_name.split(":")[-1]
    for i, kw in enumerate(keywords):
        if kw in local_name:
            return i
    return len(keywords)


def _extract_year(all_items: list[dict], duration_ctx: str, instant_ctx: str) -> dict:
    """1年分の財務数値を抽出する"""
    duration_items = [i for i in all_items if i["context"] == duration_ctx]
    instant_items  = [i for i in all_items if i["context"] == instant_ctx]

    names = {i["name"].split(":")[-1] for i in duration_items}
    if any(_IFRS_REVENUE_TAG in n for n in names):
        accounting_standard = "IFRS"
    elif any(_JGAAP_REVENUE_TAG in n for n in names):
        accounting_standard = "JGAAP"
    else:
        accounting_standard = "unknown"

    financials: dict = {"accounting_standard": accounting_standard}
    for metric, keywords in METRIC_KEYWORDS.items():
        pool = instant_items if metric in ("total_assets", "equity") else duration_items
        candidates = sorted(
            [i for i in pool if _match_metric(i["name"], keywords)],
            key=lambda i: _keyword_priority(i["name"], keywords),
        )
        if candidates:
            summary = [c for c in candidates if "SummaryOfBusinessResults" in c["name"] or "KeyFinancialData" in c["name"]]
            financials[metric] = (summary or candidates)[0]["value"]
        else:
            financials[metric] = None

    return financials


def debug_tags(xbrl_zip_path: str | Path, metric: str = "revenue") -> None:
    """指定メトリクスにマッチする全タグを出力してデバッグする"""
    all_items: list[dict] = []
    with zipfile.ZipFile(xbrl_zip_path, "r") as z:
        htm_files = [f for f in z.namelist() if f.endswith("ixbrl.htm")]
        for htm_file in htm_files:
            content = z.read(htm_file).decode("utf-8", errors="ignore")
            all_items.extend(_extract_nonfractions(content))

    if metric == "all":
        matches = all_items
    elif metric in METRIC_KEYWORDS:
        keywords = METRIC_KEYWORDS[metric]
        matches = [i for i in all_items if _match_metric(i["name"], keywords)]
    else:
        # フリーワード検索
        matches = [i for i in all_items if metric.lower() in i["name"].lower()]

    for m in matches:
        print(f"{m['name']:80s}  ctx={m['context']:50s}  val={m['value']:>20,}")


def parse_xbrl(xbrl_zip_path: str | Path, base_year: int) -> list[dict]:
    """
    EDINETからダウンロードしたXBRL ZIPを解析して5年分の財務数値を返す

    Args:
        xbrl_zip_path: _xbrl.zip のパス
        base_year: 当期の年度（例: 2024）

    Returns:
        [{year: 2024, revenue: ..., ...}, {year: 2023, ...}, ...]
    """
    all_items: list[dict] = []

    with zipfile.ZipFile(xbrl_zip_path, "r") as z:
        htm_files = [f for f in z.namelist() if f.endswith("ixbrl.htm")]
        for htm_file in htm_files:
            content = z.read(htm_file).decode("utf-8", errors="ignore")
            all_items.extend(_extract_nonfractions(content))

    results = []
    for offset, (duration_ctx, instant_ctx) in YEAR_CONTEXTS.items():
        year = base_year - offset
        financials = _extract_year(all_items, duration_ctx, instant_ctx)
        if any(v is not None for v in financials.values()):
            results.append({"year": year, **financials})

    return results


if __name__ == "__main__":
    import argparse
    import json
    from pathlib import Path

    parser = argparse.ArgumentParser()
    parser.add_argument("--ticker",  help="証券コード（例: 7203）※現在は --company と併用推奨")
    parser.add_argument("--company", help="会社名の一部（例: 日立）でフォルダを絞り込む")
    parser.add_argument("--year",    type=int, required=True, help="対象年度（例: 2024）")
    parser.add_argument("--debug",   metavar="METRIC", nargs="?", const="revenue",
                        help="タグ候補を全表示（例: revenue / operating_profit / Profit / all）")
    args = parser.parse_args()

    data_dir = Path(__file__).parent.parent / "data"
    keyword = args.company or args.ticker or ""
    zip_files = list(data_dir.glob(f"*{keyword}*/{args.year}/*_xbrl.zip"))
    if not zip_files:
        all_zips = list(data_dir.glob(f"*/{args.year}/*_xbrl.zip"))
        print(f"[error] '{keyword}' に一致するZIPが見つかりません。利用可能なZIP:")
        for z in all_zips:
            print(f"  {z}")
        exit(1)
    if len(zip_files) > 1:
        print(f"[warning] 複数のZIPがヒットしました。最初のものを使用します: {zip_files[0]}")

    if args.debug is not None:
        debug_tags(zip_files[0], metric=args.debug)
    else:
        result = parse_xbrl(zip_files[0], base_year=args.year)
        print(json.dumps(result, ensure_ascii=False, indent=2))
