# frontend

Next.js（App Router）による企業分析UIフロントエンド。VS Code ライクな IDE レイアウトで企業の有価証券報告書データを閲覧・チャットできる。

アプリ名：**CorpLens**

---

## ディレクトリ構成

```
frontend/src/
├── app/
│   ├── layout.tsx              # ルートレイアウト（ThemeProvider・TooltipProvider）
│   ├── globals.css             # グローバルスタイル・CSS変数（VSCテーマカラー等）
│   ├── page.tsx                # / → /7203 にリダイレクト
│   └── [ticker]/
│       └── page.tsx            # 企業個別ページ
├── components/
│   ├── layout/                 # アプリ全体のフレーム
│   │   ├── AppLayout.tsx       # 全体の組み立て（Sidebar・メインエリア・ChatPanel）
│   │   ├── TitleBar.tsx        # 上部タイトルバー
│   │   ├── ActivityBar.tsx     # 左端アイコンバー（企業一覧・検索・比較・ウォッチリスト）
│   │   └── StatusBar.tsx       # 下部ステータスバー
│   ├── sidebar/                # 企業一覧サイドバー
│   │   ├── Sidebar.tsx         # 折りたたみ・幅リサイズ対応。企業を業種グループで表示
│   │   ├── SectorGroup.tsx     # 業種グループの折りたたみリスト
│   │   └── CompanyItem.tsx     # 企業1行
│   ├── main/                   # メインエリア
│   │   ├── SearchBar.tsx       # 上部検索バー（名前・証券コードで絞り込み）
│   │   ├── TabBar.tsx          # タブバー（スプリットペインの左右で独立）
│   │   └── company/            # 企業詳細表示
│   │       ├── CompanyDetail.tsx       # セクションをスクロール表示する親
│   │       ├── CompanyHeader.tsx       # 企業名・証券コード・業種
│   │       ├── HumanCapitalSection.tsx # 人的資本（従業員数・年収等）
│   │       ├── BusinessSection.tsx     # 事業概要・セグメント
│   │       ├── ManagementSection.tsx   # 経営方針・リスク・課題
│   │       ├── KPIGrid.tsx             # KPIカードのグリッド
│   │       ├── KPICard.tsx             # 個別KPIカード
│   │       ├── FinancialCharts.tsx     # 財務チャート（Recharts）
│   │       └── FinancialTable.tsx      # 財務テーブル
│   └── chat/                   # RAGチャットパネル
│       ├── ChatPanel.tsx       # 右側固定・折りたたみ・幅リサイズ対応
│       ├── ChatInput.tsx       # メッセージ入力欄
│       ├── MessageList.tsx     # メッセージ一覧
│       └── MessageBubble.tsx   # 1件のメッセージ（user / ai で見た目が変わる）
├── store/
│   └── appStore.ts             # Zustand グローバル状態（詳細は後述）
├── types/
│   └── index.ts                # 共通型定義
├── data/
│   └── mockCompanies.ts        # モック企業データ・サマリー・財務データ
└── lib/
    └── utils.ts                # Tailwind クラス結合（cn関数）
```

---

## レイアウト構造

```
TitleBar
├── ActivityBar（幅固定 48px）
├── Sidebar（幅リサイズ可・折りたたみ可）
├── メインエリア（flex-1）
│   ├── SearchBar
│   ├── TabBar（left）
│   ├── CompanyDetail（left）
│   │
│   ├── [スプリット時] ドラッグ可能な仕切り
│   ├── [スプリット時] TabBar（right）
│   └── [スプリット時] CompanyDetail（right）
└── ChatPanel（幅リサイズ可・折りたたみ可）
StatusBar
```

スプリットペインは `AppLayout.tsx` の `splitRatio`（0〜1）で左右の比率を管理。仕切りをドラッグで変更できる。

---

## 状態管理（Zustand）

`store/appStore.ts` で全グローバル状態を一元管理。

| 状態 | 型 | 説明 |
|---|---|---|
| `selectedCompany` | `Company \| null` | 左ペインで選択中の企業 |
| `openTabs` | `Company[]` | 左ペインの開いているタブ |
| `splitEnabled` | `boolean` | スプリットペインのON/OFF |
| `activePane` | `'left' \| 'right'` | どちらのペインがアクティブか |
| `rightPaneCompany` | `Company \| null` | 右ペインで選択中の企業 |
| `rightPaneTabs` | `Company[]` | 右ペインのタブ |
| `chatHistories` | `Record<string, Message[]>` | 企業IDごとのチャット履歴 |
| `chatOpen` | `boolean` | ChatPanelの開閉 |
| `pendingQuestion` | `string \| null` | CompanyDetailからチャットに送る質問 |
| `searchQuery` | `string` | サイドバーの検索ワード |
| `activeFilter` | `string` | サイドバーの業種フィルタ |

`chatHistories` のみ `localStorage` に永続化（キー: `corplens-storage`）。それ以外はリロードでリセット。

---

## テーマ

`next-themes` でダーク/ライトを切替。CSS変数（`globals.css`）でカラーを管理しており、コンポーネントは `var(--vsc-editor)` 等の変数を直接参照している。

| 変数名 | 用途 |
|---|---|
| `--vsc-editor` | メインエリアの背景 |
| `--vsc-sidebar` | サイドバーの背景 |
| `--vsc-activity-bar` | ActivityBar の背景 |
| `--vsc-accent` | アクティブ・強調色 |
| `--vsc-text-muted` | 非アクティブテキスト |
| `--vsc-border` | 区切り線 |

---

## 型定義（`types/index.ts`）

| 型 | 説明 |
|---|---|
| `Company` | `id / name / ticker / sector / color` |
| `CompanySummary` | `human_capital / business / management` |
| `HumanCapital` | 従業員数・年収・平均年齢等 |
| `BusinessSummary` | 事業内容・セグメント・研究開発費等 |
| `ManagementSummary` | 経営方針・リスク・課題・設備投資 |
| `CompanyFinancials` | `ticker + FinancialYear[]` |
| `FinancialYear` | `year / revenue / net_profit / equity / total_assets` |
| `Message` | `role('ai' \| 'user') / content / timestamp` |

---

## モックデータ

`data/mockCompanies.ts` にハードコードされた企業・サマリー・財務データが入っている。バックエンド API（`/api/company`）が実装されたら差し替える。

現在のモック企業（10社）：トヨタ・ソニー・日立・NRI・NTTデータ・SBG・キーエンス・ファナック・三菱UFJ・東京エレクトロン

---

## バックエンドとの接続

現在は ChatPanel のみ実際のAPIを叩いている。

```
POST ${NEXT_PUBLIC_API_URL}/api/chat
Body: { query: string, ticker: string }
Response: { answer: string }
```

企業サマリー・財務データはまだモック。`/api/company` が実装されたら `mockCompanies.ts` 内のモックサマリー・財務データと差し替える。

---

## 環境変数

| 変数 | 用途 |
|---|---|
| `NEXT_PUBLIC_API_URL` | バックエンドAPIのベースURL（例: `http://localhost:8000`） |
