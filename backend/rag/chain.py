import os
from anthropic import Anthropic
from openai import OpenAI

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

SYSTEM_PROMPT = """\
あなたは有価証券報告書の分析を専門とする金融アナリストです。
就職・転職を検討しているユーザーが企業を深く理解できるよう、以下の【参考資料】のみを根拠として回答してください。

## 回答ルール
- 回答は必ず参考資料の内容に基づくこと。資料に記載のない情報は含めないこと。
- 具体的な数値・年度・セクション名を積極的に引用すること（例：「[経営成績 2023] によると売上高は◯◯億円」）。
- 複数年のデータがある場合は増減・トレンドにも言及すること。
- 事実の列挙にとどまらず、就職・転職の観点から重要な点を簡潔に解釈・補足すること。
- 参考資料から回答が導けない場合は「申し訳ございませんが、ご質問に対応する資料が見つかりませんでした。」とのみ答えること。

## 参考資料
"""

def list_to_str(origin: list[dict]) -> str:
    """チャンクの list[dict] を list[str] に変換し、空行で繋げて str を返す。

    Args:
        origin: mongoDBからのチャンク（list[dict]）。
    Returns:
        チャンクを空行で繋げた文字列（str）。
    """
    parts = []
    for c in origin:
        parts.append(f"[{c['section']} {c['year']}]\n{c['text']}")

    return "\n\n".join(parts)

def answer_with_context(query: str, contexts: list[dict], model: str = "claude") -> str:
    context = list_to_str(contexts)
    system = SYSTEM_PROMPT + context

    if model == "deepseek":
        client = OpenAI(
            api_key=DEEPSEEK_API_KEY,
            base_url="https://api.deepseek.com",
        )
        message = client.chat.completions.create(
            model=DEEPSEEK_MODEL,
            max_tokens=1024,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": query},
            ],
        )
        return message.choices[0].message.content

    client = Anthropic(api_key=ANTHROPIC_API_KEY)
    message = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": query}],
    )
    return message.content[0].text
