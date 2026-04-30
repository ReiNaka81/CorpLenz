# backend

FastAPI による RAG バックエンド。有価証券報告書の取り込み・ベクトル化・検索・Claude への問い合わせを担う。

---

## ディレクトリ構成

```
backend/
├── api/                    # FastAPI エンドポイント
│   ├── main.py             # アプリ定義・CORS・ルーター登録
│   ├── chat.py             # POST /api/chat
│   ├── company.py          # GET /api/company
│   └── companies.py        # GET /api/companies
├── rag/                    # RAG 検索・回答生成
│   ├── retriever.py        # MongoDB Vector Search でチャンク取得
│   └── chain.py            # Claude API への問い合わせ・回答生成
├── ingestion/              # データ取り込みパイプライン
│   ├── ingest.py           # エントリーポイント（EDINET → MongoDB）
│   ├── edinet.py           # EDINET API クライアント（XBRL ZIP 取得）
│   ├── html_parser.py      # iXBRL HTML → Markdown 変換
│   ├── maps.py             # EDINETコード → セクション名・業種名の対応表
│   ├── chunker.py          # Markdown → チャンク分割
│   ├── embedding.py        # Voyage AI Embedding → MongoDB 保存
│   ├── xbrl_parser.py      # XBRL タグ → 財務数値の抽出（5年分・億円）
│   └── summarizer.py       # Claude/DeepSeek API で企業サマリーを構造化生成
├── models/
│   └── models.py           # Pydantic モデル定義（API・LLM 共通）
├── db/
│   └── mongo.py            # MongoDB 接続・コレクション取得
└── data/                   # EDINET からダウンロードした XBRL ZIP（git 管理外）
    └── {会社名}/{year}/
```

---

## モジュールの責務

### `ingestion/`

| ファイル | 役割 |
|---|---|
| `edinet.py` | EDINET API から有価証券報告書の XBRL ZIP・PDF をダウンロードして `data/` に保存。会社名・業種も自動取得 |
| `html_parser.py` | ZIP 内の iXBRL HTML を読み込み、XBRL タグを除去して Markdown に変換。セクションごとに分割して返す |
| `maps.py` | EDINET のセクションコード（例: `0102010`）→ 日本語名、EDINETコード → 東証33業種名 の対応表 |
| `chunker.py` | `html_parser.py` の出力を 500字・100字オーバーラップでチャンク化。`ticker`・`year`・`section` をメタデータとして付与 |
| `embedding.py` | Voyage AI `voyage-finance-2` でチャンクをベクトル化して MongoDB `chunks` に保存 |
| `xbrl_parser.py` | XBRL タグから財務数値（売上・純利益・総資産・純資産）を抽出し MongoDB `financials` に保存。IFRS/J-GAAP 両対応・5年分・億円単位 |
| `summarizer.py` | 有価証券報告書の Markdown を LLM に渡し、人的資本・事業概要・経営方針を構造化 JSON で生成。Claude / DeepSeek を切り替え可能 |
| `ingest.py` | 上記を順番に呼ぶパイプラインのエントリーポイント |

### `rag/`

| ファイル | 役割 |
|---|---|
| `retriever.py` | クエリを Voyage AI でベクトル化 → MongoDB Atlas Vector Search で `ticker` フィルタをかけて top_k 件取得 |
| `chain.py` | 取得したチャンクをシステムプロンプトに埋め込み、Claude API に投げて回答を生成 |

### `api/`

| ファイル | 役割 |
|---|---|
| `main.py` | FastAPI アプリ定義。CORS・ルーター登録 |
| `chat.py` | `POST /api/chat`。`{ query, ticker }` を受け取り `{ answer }` を返す |
| `company.py` | `GET /api/company?ticker=XXXX`。企業サマリー＋財務データを返す |
| `companies.py` | `GET /api/companies`。登録済み全企業の一覧を返す |

### `db/`

| ファイル | 役割 |
|---|---|
| `mongo.py` | `MONGODB_URI` 環境変数から MongoDB Atlas に接続。`get_collection(name)` でコレクションを返す |

---

## データフロー

### 取り込み時（1回だけ）

```
EDINET API
  └─ edinet.py      → XBRL ZIP を data/ に保存
  └─ html_parser.py → iXBRL HTML → Markdown（セクションごと）
  └─ chunker.py     → 500字チャンク + メタデータ付与
  └─ embedding.py   → Voyage AI でベクトル化 → MongoDB chunks に保存
  └─ xbrl_parser.py → 財務数値抽出 → MongoDB financials に保存（億円）
  └─ summarizer.py  → LLM で構造化サマリー生成 → MongoDB companies に保存
```

### チャット時（リクエストごと）

```
POST /api/chat { query, ticker }
  └─ retriever.py → Vector Search でチャンク取得（top_k=5）
  └─ chain.py     → Claude API に質問 + チャンクを渡す
  └─ { answer }   を返す
```

---

## 環境変数

| 変数 | 用途 |
|---|---|
| `MONGODB_URI` | MongoDB Atlas 接続文字列（フル URI） |
| `ANTHROPIC_API_KEY` | Claude API |
| `CLAUDE_MODEL` | 使用モデル（例: `claude-sonnet-4-6`） |
| `VOYAGE_API_KEY` | Voyage AI Embedding |
| `EDINET_API_KEY` | EDINET API |
| `DEEPSEEK_API_KEY` | DeepSeek API（`--summarizer deepseek` 使用時） |
| `DEEPSEEK_MODEL` | DeepSeek モデル（デフォルト: `deepseek-chat`） |

すべて Infisical で管理。起動時は `infisical run --env=dev --` を先頭に付ける。
