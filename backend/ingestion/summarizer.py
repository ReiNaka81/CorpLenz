import os
import json
from anthropic import Anthropic
from models.models import CompanySummary

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

# サマリー生成に使うセクション名（section_map.pyの値と対応）
SUMMARY_SECTIONS = {
    "提出会社の状況",    # 従業員数・平均年齢・平均年収・女性管理職比率（一般企業）
    "従業員の状況",      # 同上（銀行・持株会社など 0101020 に記載される場合）
    "企業の概況",        # 事業内容・沿革
    "事業の状況",        # 事業詳細
    "セグメント情報",    # セグメント別売上構成
    "経営方針・経営環境", # 経営方針・対処すべき課題
    "リスク情報",        # 事業リスク
}

SYSTEM_PROMPT = """\
あなたは有価証券報告書の分析を専門とする金融アナリストです。
提供された有価証券報告書の各セクションから、指定のJSONスキーマに従って企業サマリーを生成してください。

## ルール
- 数値はすべて報告書本文から読み取った値を使用する。記載がない場合は 0 を入れる
- female_manager_ratio は持株会社等でグループ全体の数値がない場合、主要な子会社（銀行・証券等）の数値を使用する
- average_salary は万円単位で返す
- revenue_ratio は 0〜1 の小数で返す（例: 89% → 0.89）。売上データが見つからない場合は純利益ベースの構成比で代替する
- 赤字・損失のセグメントも含める。その場合は revenue_ratio をマイナス値で返す（例: -0.017）
- テキストフィールドは日本語で簡潔にまとめる（commentary は3〜5文程度）

## 出力例（トヨタ自動車 2024年度）

```json
{
  "human_capital": {
    "employee_count_consolidated": 375235,
    "employee_count_standalone": 72567,
    "average_age": 40.5,
    "average_tenure": 17.2,
    "average_salary": 895,
    "female_manager_ratio": 8.2,
    "commentary": "連結従業員数は国内製造業最大規模の37万人超。平均勤続年数17年超と離職率が低く、長期雇用が根付いた文化を持つ。平均年収895万円は製造業トップクラス。女性管理職比率は8.2%と業界平均を上回るが、さらなる向上が課題として掲げられている。"
  },
  "business": {
    "description": "自動車の設計・製造・販売を中核事業とし、ハイブリッド・電気・燃料電池車など幅広いパワートレインを展開。金融サービス（ローン・リース）も収益の柱。トヨタ生産方式（TPS）はグローバルで製造業のスタンダードとなっている。",
    "segments": [
      { "name": "自動車", "revenue_ratio": 0.89 },
      { "name": "金融",   "revenue_ratio": 0.08 },
      { "name": "その他", "revenue_ratio": 0.03 }
    ],
    "history_highlights": "1937年豊田自動車工業として設立。1950年代に量産体制を確立し国内トップへ。1997年プリウス発売でハイブリッド車市場を開拓。2023年純利益5兆円超で過去最高を更新。"
  },
  "management": {
    "policy": "カーボンニュートラル実現に向けた「全方位戦略」を掲げ、HV・PHV・EV・FCEVを並行展開。2030年までにEV150万台販売を目標とする。ソフトウェア定義車両（SDV）への転換も重点投資領域。",
    "challenges": "電動化投資と既存事業収益のバランス確保。半導体・電池などサプライチェーンの安定化。ソフトウェア人材の確保と社内DX推進。新興EV勢力（BYD等）との価格競争への対応。",
    "risks": "為替リスク（1円の円安で約500億円の営業利益増減）。電動化移行期のモデルミックス変化。原材料（希少金属・鉄鋼）の価格変動。各国の排ガス規制強化への対応コスト。"
  }
}
```
"""

def build_context(sections: list[dict]) -> str:
    """対象セクションのmarkdownを結合してコンテキスト文字列を返す"""
    parts = [
        f"## {s['section']}\n{s['markdown']}"
        for s in sections
        if s["section"] in SUMMARY_SECTIONS
    ]
    return "\n\n".join(parts)


def generate_with_claude(context: str) -> CompanySummary:
    client = Anthropic(api_key=ANTHROPIC_API_KEY)
    response = client.messages.parse(
        model=CLAUDE_MODEL,
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        output_format=CompanySummary,
        messages=[{"role": "user", "content": context}],
    )
    return response.parsed_output


def generate_with_deepseek(context: str) -> CompanySummary:
    client = Anthropic(
        api_key=DEEPSEEK_API_KEY,
        base_url="https://api.deepseek.com/anthropic",
    )
    response = client.messages.create(
        model=DEEPSEEK_MODEL,
        max_tokens=8192,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": context}],
    )
    text = next(block.text for block in response.content if hasattr(block, "text"))
    text = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    data = json.loads(text)
    return CompanySummary.model_validate(data)


def generate_summary(sections: list[dict], summarizer: str = "claude") -> CompanySummary:
    """
    有価証券報告書のセクションMarkdownからCompanySummaryを生成する。

    Args:
        sections: parse_ixbrl()の出力（list of {"section": str, "markdown": str}）
        summarizer: "claude" or "deepseek"
    Returns:
        CompanySummary
    """
    context = build_context(sections)

    if summarizer == "deepseek":
        result = generate_with_deepseek(context)
    else:
        result = generate_with_claude(context)

    print(f"サマリーを作成しました。({summarizer})")
    return result
