# backend

FastAPI + LangChain による RAG バックエンド。有価証券報告書の取り込み・ベクトル化・検索・Claude への問い合わせを担う。

---

## ディレクトリ構成

```
backend/
├── api/                    # FastAPI エンドポイント
│   ├── main.py             # アプリ定義・CORS・ルーター登録
│   └── chat.py             # POST /api/chat
├── rag/                    # RAG 検索・回答生成
│   ├── retriever.py        # MongoDB Vector Search でチャンク取得
│   └── chain.py            # Claude API への問い合わせ・回答生成
├── ingestion/              # データ取り込みパイプライン
│   ├── ingest.py           # エントリーポイント（ZIP → MongoDB）
│   ├── edinet.py           # EDINET API クライアント（XBRL ZIP取得）
│   ├── html_parser.py      # iXBRL HTML → Markdown 変換
│   ├── section_map.py      # EDINETセクションコード → セクション名の対応表
│   ├── chunker.py          # Markdown → チャンク分割
│   ├── embedding.py        # Voyage AI Embedding → MongoDB 保存
│   └── xbrl_parser.py      # XBRL タグ → 財務数値の抽出
├── db/
│   └── mongo.py            # MongoDB 接続・コレクション取得
└── data/                   # EDINET からダウンロードした XBRL ZIP（git管理外）
    └── {会社名}/{year}/{docID}_xbrl.zip
```

---

## モジュールの責務

### `ingestion/`

| ファイル | 役割 |
|---|---|
| `edinet.py` | EDINET API から XBRL ZIP をダウンロードして `data/` に保存 |
| `html_parser.py` | ZIP 内の iXBRL HTML を読み込み、XBRLタグを除去して Markdown に変換。セクションごとに分割して返す |
| `section_map.py` | EDINET のセクションコード（例: `0102010`）を日本語セクション名（例: `事業の内容`）に変換するマップ |
| `chunker.py` | `html_parser.py` の出力を 500字・100字オーバーラップでチャンク化。`ticker`・`year`・`section` をメタデータとして付与 |
| `embedding.py` | Voyage AI `voyage-finance-2` でチャンクをベクトル化して MongoDB `chunks` コレクションに保存 |
| `ingest.py` | 上記を順番に呼ぶパイプラインのエントリーポイント。`--zip`・`--ticker`・`--year` を受け取る |
| `xbrl_parser.py` | XBRL タグから財務数値（売上・純利益・総資産等）を抽出。現時点は検証用途（MongoDB保存は未実装） |

### `rag/`

| ファイル | 役割 |
|---|---|
| `retriever.py` | クエリを Voyage AI でベクトル化 → MongoDB Atlas Vector Search で `ticker` フィルタをかけて top_k 件取得 |
| `chain.py` | 取得したチャンクをシステムプロンプトに埋め込み、Claude API（Anthropic SDK）に投げて回答を生成 |

### `api/`

| ファイル | 役割 |
|---|---|
| `main.py` | FastAPI アプリ定義。CORS（`localhost:3000` を許可）・ルーター登録 |
| `chat.py` | `POST /api/chat`。`{ query, ticker }` を受け取り `{ answer }` を返す |

### `db/`

| ファイル | 役割 |
|---|---|
| `mongo.py` | `DB_USER`・`DB_PASSWORD` 環境変数から MongoDB Atlas に接続。`get_collection(name)` でコレクションを返す |

---

## データフロー

### 取り込み時（1回だけ）

```
EDINET API
  └─ edinet.py      → XBRL ZIP を data/ に保存
  └─ html_parser.py → iXBRL HTML → Markdown（セクションごと）
  └─ chunker.py     → 500字チャンク + メタデータ付与
  └─ embedding.py   → Voyage AI でベクトル化 → MongoDB chunks に保存
```

### チャット時（リクエストごと）

```
POST /api/chat { query, ticker }
  └─ retriever.py → Vector Search でチャンク取得（top_k=5）
  └─ chain.py     → Claude API に質問 + チャンクを渡す
  └─ { answer }   を返す
```

---

## 未実装（予定）

- `api/company.py` — 企業サマリー・財務データ取得
- `api/news.py` — Tavily API でニュース取得
- `api/analyze.py` — ニュース×有価証券報告書照合分析
- `api/es.py` — ES添削
- `xbrl_parser.py` → `financials` コレクションへの保存
- LLMによる企業サマリー事前生成（ingestion時）
- `rag/router.py` — 質問種別に応じた Tool 振り分け

---

## 環境変数

| 変数 | 用途 |
|---|---|
| `DB_USER` | MongoDB Atlas ユーザー名 |
| `DB_PASSWORD` | MongoDB Atlas パスワード |
| `ANTHROPIC_API_KEY` | Claude API |
| `CLAUDE_MODEL` | 使用モデル（例: `claude-sonnet-4-5`） |
| `VOYAGE_API_KEY` | Voyage AI Embedding |
| `EDINET_API_KEY` | EDINET API |

すべて Infisical で管理。起動時は `infisical run --env=dev --` を先頭に付ける。
