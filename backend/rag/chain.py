import os
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL")

SYSTEM_PROMPT = """\
あなたは有価証券報告書の分析を専門とする金融アナリストです。
以下の【参考資料】のみを根拠として、ユーザーの質問に正確かつ簡潔に回答してください。

## 回答ルール
- 回答は必ず参考資料の内容に基づくこと。資料に記載のない情報は含めないこと。
- 回答に使用した箇所のセクション名・年度を明示すること（例：「[経営成績 2023] によると〜」）。
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

def answer_with_context(query: str, context: str) -> str:   
    """質問文とチャンクをclaudeに投げ、回答を返却する。
    
    Args:
        query: ユーザの質問文。
        context: mongoDBからのチャンク。
    """

    client = Anthropic(
        api_key = ANTHROPIC_API_KEY,
    )

    message = client.messages.create(
        model = CLAUDE_MODEL,
        max_tokens = 1024,
        system = SYSTEM_PROMPT + context,
        messages = [
            {
                "role": "user",
                "content": query,
            }
        ],
    )

    return message.content[0].text
