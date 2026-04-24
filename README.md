# CorpLens — 有価証券報告書 RAG 企業分析ツール

有価証券報告書を一次情報として企業を深堀りする、**就活特化型の企業分析ツール**。

VS Code ライクな IDE レイアウトで企業データを閲覧しながら、有価証券報告書に基づいた自然言語チャットができる。

---

## 機能

- **企業サマリー表示** — 人的資本・事業概要・将来性・経営課題を構造化して表示（取り込み時にLLM生成・DB保存）
- **財務グラフ・KPI** — XBRL から取得した財務数値を Recharts でグラフ化
- **RAGチャット** — 有価証券報告書テキストに基づいて自然言語で質問・回答
- **スプリットペイン** — 2社を並べて比較閲覧
- **ダーク/ライトテーマ** — next-themes によるテーマ切替

予定：ニュース自動取得・ニュース×有価証券報告書照合分析・ES添削

## 技術スタック

| 層 | 技術 |
|---|---|
| フロントエンド | Next.js（App Router）+ Tailwind CSS + shadcn/ui |
| 状態管理 | Zustand |
| グラフ | Recharts |
| バックエンド | FastAPI |
| LLM | Claude API（Anthropic SDK） |
| Embedding | Voyage AI voyage-finance-2（1024次元） |
| ベクトルDB | MongoDB Atlas Vector Search |
| シークレット管理 | Infisical |
| コンテナ | Docker Compose |

## ディレクトリ構成

```
recruit_llm_app/
├── backend/        # FastAPI + RAGパイプライン（→ backend/README.md）
├── frontend/       # Next.js UI（→ frontend/README.md）
├── docs/           # プロジェクト全体のドキュメント
│   ├── 要件定義書.md
│   ├── 設計書.md
│   └── 開発環境.md
└── docker-compose.yml
```

## クイックスタート

```bash
# 起動（Infisical でシークレットを注入）
infisical run --env=dev -- docker compose up --build
```

| URL | 内容 |
|---|---|
| http://localhost:3000 | フロントエンド |
| http://localhost:8000/docs | バックエンド Swagger UI |

詳細なセットアップ手順は [docs/開発環境.md](docs/開発環境.md) を参照。

## ドキュメント

| ドキュメント | 内容 |
|---|---|
| [docs/要件定義書.md](docs/要件定義書.md) | コンセプト・機能要件・ロードマップ |
| [docs/設計書.md](docs/設計書.md) | アーキテクチャ・DB設計・APIエンドポイント |
| [docs/開発環境.md](docs/開発環境.md) | ローカル起動・データ取り込み・デプロイ |
| [backend/README.md](backend/README.md) | バックエンドの技術構成・モジュール責務 |
| [frontend/README.md](frontend/README.md) | フロントエンドの技術構成・状態管理 |
