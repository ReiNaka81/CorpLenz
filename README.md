# 有価証券報告書RAGアプリ

有価証券報告書（有価証券報告書）をRAGで検索する、**就活特化型の企業分析ツール**。

一次情報（有価証券報告書）ベースで企業を深堀りし、ES添削・財務グラフ・最新ニュース照合まで対応する。

---

## 機能

- **企業概要・財務グラフ** — EDINET XBRL APIから取得した財務数値をグラフで可視化
- **RAGチャット** — 有価証券報告書テキストを自然言語で質問（競合比較・横断質問にも対応）
- **最新ニュース自動取得** — Web検索で企業ニュースを自動取得（LLM不使用）
- **ニュース × 有価証券報告書照合分析** — ニュースと有価証券報告書をLLMで照合し、企業動向を分析
- **ES添削** — エントリーシートを有価証券報告書の情報で裏付けてフィードバック

## 技術スタック

| 層 | 技術 |
|---|---|
| フロントエンド | Next.js + NextAuth |
| バックエンド | FastAPI + LangChain |
| DB | MongoDB Atlas（Vector Search） |
| LLM | Claude API（claude-sonnet） |
| Embedding | OpenAI text-embedding-3-small |
| PDF変換 | pymupdf4llm |
| Web検索 | Tavily API |
| デプロイ | Vercel（フロント）/ Railway（バック） |

## ディレクトリ構成

```
recruit_llm_app/
├── backend/
│   ├── ingestion/   # EDINETからのデータ取り込みパイプライン
│   ├── rag/         # RAG検索・質問ルーティング・LangChainチェーン
│   ├── tools/       # 財務数値取得・Web検索・横断比較ツール
│   ├── api/         # FastAPI エンドポイント
│   ├── db/          # MongoDB接続・クエリ
│   └── models/      # Pydanticモデル
├── frontend/
│   ├── app/         # Next.js App Router（企業一覧・個別・比較ページ）
│   ├── components/  # UIコンポーネント
│   └── lib/         # APIクライアント
└── docs/            # 要件定義・設計書・開発環境構築
```

## セットアップ

詳細は [docs/開発環境.md](docs/開発環境.md) を参照。

### バックエンド

```bash
cd backend
uv venv && source .venv/bin/activate
uv pip install -r requirements.txt
cp .env.example .env  # 環境変数を設定
uvicorn api.main:app --reload --port 8000
```

### フロントエンド

```bash
cd frontend
npm install
cp .env.local.example .env.local  # 環境変数を設定
npm run dev
```

### データ取り込み（初回）

```bash
cd backend
source .venv/bin/activate
python -m ingestion.edinet --ticker 7203 --year 2024
```

## 必要な環境変数

| 変数 | 用途 |
|---|---|
| `MONGODB_URI` | MongoDB Atlas 接続文字列 |
| `OPENAI_API_KEY` | Embedding生成 |
| `ANTHROPIC_API_KEY` | LLM（Claude API） |
| `TAVILY_API_KEY` | Web検索 |
| `LANGCHAIN_API_KEY` | LangSmithロギング（開発） |

## ドキュメント

- [要件定義書](docs/要件定義書.md)
- [設計書](docs/設計書.md)
- [開発環境](docs/開発環境.md)
