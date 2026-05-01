# frontend

Next.jsによる企業分析 UI。VS Code ライクな IDE レイアウトで有価証券報告書データを閲覧・チャットできる。

---

## ディレクトリ構成

```
frontend/src/
├── app/
│   ├── layout.tsx              # ルートレイアウト（ThemeProvider・TooltipProvider）
│   ├── globals.css             # グローバルスタイル・CSS 変数（VSC テーマカラー等）
│   ├── page.tsx                # / → /7203 にリダイレクト
│   └── [ticker]/
│       └── page.tsx            # 企業個別ページ
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx       # 全体の組み立て（Sidebar・メインエリア・ChatPanel・モバイル対応）
│   │   ├── TitleBar.tsx        # 上部タイトルバー（デスクトップのみ）
│   │   ├── ActivityBar.tsx     # 左端アイコンバー（デスクトップのみ）
│   │   └── StatusBar.tsx       # 下部ステータスバー
│   ├── sidebar/
│   │   ├── Sidebar.tsx         # 折りたたみ・幅リサイズ対応。企業を業種グループで表示
│   │   ├── SectorGroup.tsx     # 業種グループの折りたたみリスト
│   │   └── CompanyItem.tsx     # 企業 1 行
│   ├── main/
│   │   ├── SearchBar.tsx       # 検索バー（名前・証券コードで絞り込み・業種フィルター）
│   │   ├── TabBar.tsx          # タブバー（スプリットペインの左右で独立）
│   │   └── company/
│   │       ├── CompanyDetail.tsx
│   │       ├── CompanyHeader.tsx
│   │       ├── HumanCapitalSection.tsx
│   │       ├── BusinessSection.tsx
│   │       ├── ManagementSection.tsx
│   │       ├── KPIGrid.tsx / KPICard.tsx
│   │       ├── FinancialCharts.tsx
│   │       └── FinancialTable.tsx
│   └── chat/
│       ├── ChatPanel.tsx
│       ├── ChatInput.tsx
│       ├── MessageList.tsx
│       └── MessageBubble.tsx
├── store/
│   └── appStore.ts             # Zustand グローバル状態
├── types/
│   └── index.ts                # 共通型定義
└── lib/
    └── utils.ts                # cn 関数・tickerToColor ユーティリティ
```

---

## レイアウト構造

### デスクトップ

```
TitleBar
ActivityBar（48px固定）+ Sidebar（リサイズ可）+ メインエリア + ChatPanel
  メインエリア：SearchBar / TabBar / CompanyDetail（スプリット対応）
StatusBar
```

### モバイル

```
ヘッダーバー（ハンバーガー / タイトル / チャットトグル）
メインエリア（企業詳細）
サイドバー：ハンバーガーで開くフルスクリーンオーバーレイ
  SearchBar（オーバーレイ内上部）+ 企業一覧
```

---

## 状態管理（Zustand）

`store/appStore.ts` で全グローバル状態を一元管理。

| 状態 | 型 | 説明 |
|---|---|---|
| `companies` | `Company[]` | `/api/companies` から取得した企業一覧 |
| `selectedCompany` | `Company \| null` | 左ペインで選択中の企業 |
| `openTabs` | `Company[]` | 左ペインの開いているタブ |
| `splitEnabled` | `boolean` | スプリットペイン ON/OFF |
| `activePane` | `'left' \| 'right'` | アクティブなペイン |
| `rightPaneCompany` | `Company \| null` | 右ペインで選択中の企業 |
| `rightPaneTabs` | `Company[]` | 右ペインのタブ |
| `chatHistories` | `Record<string, Message[]>` | 企業ごとのチャット履歴 |
| `chatOpen` | `boolean` | ChatPanel の開閉 |
| `pendingQuestion` | `string \| null` | CompanyDetail からチャットに送る質問 |
| `searchQuery` | `string` | サイドバーの検索ワード |
| `activeFilters` | `string[]` | サイドバーの業種フィルター（複数選択可） |

`chatHistories` のみ `localStorage` に永続化（キー: `CorpLenz-storage`）。

---

## テーマ

`next-themes` でダーク/ライトを切替。`globals.css` の CSS 変数でカラーを管理。

| 変数名 | 用途 |
|---|---|
| `--vsc-editor` | メインエリアの背景 |
| `--vsc-sidebar` | サイドバーの背景 |
| `--vsc-accent` | アクティブ・強調色 |
| `--vsc-text-muted` | 非アクティブテキスト |
| `--vsc-border` | 区切り線 |

---

## バックエンドとの接続

| エンドポイント | 用途 |
|---|---|
| `GET /api/companies` | 企業一覧（AppLayout マウント時） |
| `GET /api/company?ticker=XXXX` | 企業サマリー＋財務データ（企業選択時） |
| `POST /api/chat` | RAG チャット |

---

## 環境変数

ビルド時に値が焼き込まれるため、ローカルは `.env.local`、本番は Cloudflare Dashboard の Build Variables に登録する。

| 変数 | 用途 |
|---|---|
| `NEXT_PUBLIC_API_URL` | バックエンド API のベース URL（例: `http://localhost:8000`） |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk 認証の公開キー |
