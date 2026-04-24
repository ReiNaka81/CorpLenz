# CorpLens UI 設計仕様書

## コンポーネント構成

```
AppLayout
├── TitleBar
├── AppBody (flex row)
│   ├── ActivityBar
│   ├── Sidebar
│   ├── MainPanel（スプリット対応：左右2ペイン）
│   │   ├── SearchBar（ペイン共通・上部固定）
│   │   ├── [左ペイン]
│   │   │   ├── TabBar
│   │   │   └── CompanyDetail
│   │   │       ├── CompanyHeader
│   │   │       ├── HumanCapitalSection   ← ① 人的資本
│   │   │       ├── BusinessSection       ← ② 事業概要
│   │   │       ├── ManagementSection     ← ③ 将来性・経営課題
│   │   │       ├── KPIGrid               ← ④ 財務
│   │   │       ├── FinancialCharts
│   │   │       └── FinancialTable
│   │   └── [右ペイン（スプリット時）]
│   │       ├── TabBar
│   │       └── CompanyDetail（同構成）
│   └── ChatPanel
│       ├── ChatHeader
│       ├── MessageList
│       └── ChatInput
└── StatusBar
```

---

## ルーティング（Next.js App Router）

```
src/app/
├── layout.tsx           # RootLayout — フォント・グローバルCSS・SessionProvider
├── page.tsx             # / → /[ticker] へリダイレクト（or 企業一覧初期表示）
├── [ticker]/
│   └── page.tsx         # /7203 — 企業詳細（AppLayout を丸ごとレンダリング）
└── compare/
    └── page.tsx         # /compare — 複数企業比較（Phase 2 以降）
```

### URL 設計

| URL | 内容 |
|---|---|
| `/` | 最初に選択した企業にリダイレクト |
| `/[ticker]` | 企業詳細ページ（例: `/7203`） |
| `/compare?tickers=7203,9984` | 比較ページ（Phase 2） |

> `[ticker]` は証券コード（4〜5桁の数字文字列）。`page.tsx` は Server Component として企業メタデータを取得し、クライアント側の `AppLayout` に props として渡す。

---

## shadcn/ui モジュール

| コンポーネント | 用途 |
|---|---|
| `Input` | 検索バー |
| `Button` | フィルターボタン、チャット送信 |
| `Badge` | 証券コード表示（例: 4307.T） |
| `Tabs` | タブバー（企業ごとに開く） |
| `ScrollArea` | サイドバー・チャット履歴のスクロール |
| `Separator` | セクション区切り |
| `Tooltip` | アクティビティバーのアイコン説明 |
| `Textarea` | チャット入力欄 |
| `Table` | 財務テーブルのベース |
| `Card` | KPIカードのベース |

shadcn で賄えないもの（自作）：

- `SparklineChart` → Recharts `AreaChart`（後述）
- `KPICard` → `Card` ベースに自作
- `CompanyItem` → サイドバーの企業行

---

## 各セクションの詳細

### ActivityBar

- アイコンのみ（企業一覧 / 検索 / 比較 / ウォッチリスト / 設定）
- `Tooltip` でホバー時にラベル表示
- active 状態で左端に青いライン（`::before` 疑似要素）
- 設定アイコンは `margin-top: auto` で一番下に固定

### Sidebar

- セクターごとに `SectorGroup` でグループ化
- 展開 / 折りたたみ → `useState` でトグル、矢印アイコンを回転
- `ScrollArea` でリストをスクロール
- 各企業アイテム（`CompanyItem`）
  - カラードット・企業名・証券コード（右寄せ）
  - クリックで `selectedCompany` を更新し `/[ticker]` へルーター遷移
  - active 時に左端ラインと背景色変化

**セクター分類：** バックエンドの企業マスタ（MongoDB の `companies` コレクション）に格納する `sector` フィールドに準拠。SearchBar のフィルター選択肢はこのマスタから動的に生成する。

### SearchBar

- `Input` + フィルター `Button` 群
- `⌘K` ショートカット → `useEffect` + `keydown` リスナー
- フォーカス時にボーダーとグロー変化
- フィルターはセクター単一選択（選択肢はマスタから取得）+ 「すべて」

### TabBar

- shadcn `Tabs` をベースに拡張
- 企業選択時に自動でタブ追加（重複チェックあり）
- × ボタンでタブ削除（`closeTab` → URL を残った最後のタブへ更新）
- タブがオーバーフローしたら横スクロール

### CompanyDetail

縦スクロール＋セクションヘッダー方式。`ScrollArea` で全体をラップし、セクションを上から順に表示する。

#### セクション構成

| # | セクション | コンポーネント | データソース |
|---|---|---|---|
| ① | 人的資本 | `HumanCapitalSection` | `companies.summary.human_capital` |
| ② | 事業概要 | `BusinessSection` | `companies.summary.business` |
| ③ | 将来性・経営課題 | `ManagementSection` | `companies.summary.management` |
| ④ | 財務（既存） | `KPIGrid` + `FinancialCharts` + `FinancialTable` | `financials` |

#### CompanyHeader

- 企業ロゴ（イニシャル自動生成、`company.color` で背景色）
- 企業名 + `Badge`（証券コード）
- 所在地・従業員数・業種（サブテキスト）
- ※株価リアルタイム表示は Phase 2 以降（外部株価 API 連携が必要なため初期は非表示）

#### KPIGrid

- 4 カラムグリッド
- 各カード：ラベル / 値 / サブテキスト / トレンド（▲▼）
- 表示項目は EDINET XBRL から取得できる値のみ使用：

| KPI | XBRL フィールド | 備考 |
|---|---|---|
| 売上高 | `revenue` | 最新年度 |
| 純利益 | `net_profit` | 最新年度 |
| ROE | `net_profit / equity × 100` | フロントで計算 |
| 純資産 | `equity` | 最新年度 |

> 時価総額は XBRL から取得不可のため除外。将来的に株価 API 連携時に追加する。

#### FinancialCharts

- 2 カラムグリッド
- 各チャートカード：タイトル / 最新値 / スパークライン
- スパークライン実装：**Recharts `AreaChart`** に統一（Canvas 直書きは廃止）
- 表示項目：売上高推移 / 純利益推移（最大 5 年分、XBRL の取得年度に依存）

#### FinancialTable

- shadcn `Table` ベース
- 列：項目 / **（取得年度を動的に生成）** / YoY
  - 年度列は XBRL パーサーが返す `year` フィールドの配列から生成（最大 5 年分）
  - 例: `[2020, 2021, 2022, 2023, 2024]` → 5 列
- 表示行：売上高 / 純利益 / 総資産 / 純資産
- YoY 列はプラス → 緑、マイナス → 赤
- ホバー時に行をハイライト

### ChatPanel

#### ChatHeader

- pulsing グリーンドット（AI 接続状態）
- "AI アナリスト" タイトル + 選択企業名サブテキスト

#### MessageList

- `ScrollArea` 内にメッセージを積み上げ
- `MessageBubble` は AI / User で見た目を分岐
  - AI：左寄せ、パネル背景色、ボーダーあり
  - User：右寄せ、アクセント色背景
- コードブロック（`msg-code`）：モノスペースフォント、暗背景
- Phase 3 でストリーミング受信時は AI バブルを逐次追記（後述）

#### ChatInput

- `Textarea`（自動リサイズ、最大高さ 80px）
- `Enter` で送信 / `Shift+Enter` で改行
- 送信 `Button`（`↑` アイコン）

### StatusBar

- 左：接続状態 / ロード済み企業数 / 最終更新時刻
- 右：取引所名 / 文字コード（VSCode 風）
- 1 分ごとに時刻を自動更新

---

## API エンドポイント仕様

### 現在実装済み

| メソッド | パス | リクエスト | レスポンス |
|---|---|---|---|
| `POST` | `/api/chat` | `{ query: string, ticker: string }` | `{ answer: string }` |

### Phase 2 で追加予定（バックエンドとの合意が必要）

| メソッド | パス | レスポンス概要 |
|---|---|---|
| `GET` | `/api/companies` | 企業マスタ一覧 |
| `GET` | `/api/companies/:ticker` | 企業メタデータ |
| `GET` | `/api/companies/:ticker/financials` | XBRL財務データ（5年分） |

### Phase 3（SSE ストリーミング）

| メソッド | パス | 備考 |
|---|---|---|
| `POST` | `/api/chat/stream` | `text/event-stream` で逐次返却 |

---

## API クライアント実装方針

- **Phase 1〜2：** ネイティブ `fetch` を使用（axios は不採用）。Next.js の `fetch` はキャッシュ制御（`cache: 'no-store'` など）をサポートしており、別ライブラリ不要。
- **Phase 3 SSE：** `@microsoft/fetch-event-source` を使用。
  - `EventSource` は GET + 認証ヘッダー非対応のため不採用。
  - `fetch-event-source` は POST + カスタムヘッダーに対応し、再接続も自動処理。

```ts
// Phase 3 チャット送信イメージ
import { fetchEventSource } from '@microsoft/fetch-event-source'

await fetchEventSource('/api/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, ticker }),
  onmessage(ev) {
    appendToken(ev.data) // AI バブルにトークンを追記
  },
})
```

---

## State 設計（Zustand）

```ts
interface Company {
  id: string
  name: string
  ticker: string
  sector: string
  color: string  // フロントエンド表示専用（アバター背景色）。バックエンドには存在しない。
                 // ticker の先頭文字などからハッシュで固定色をアサインする。
}

interface Message {
  role: 'ai' | 'user'
  content: string
  timestamp: Date
}

interface AppStore {
  // 企業
  selectedCompany: Company | null
  openTabs: Company[]
  setSelectedCompany: (company: Company) => void
  closeTab: (id: string) => void

  // チャット（企業ごとに独立）
  chatHistories: Record<string, Message[]>
  addMessage: (companyId: string, message: Message) => void

  // 検索
  searchQuery: string
  activeFilter: string
  setSearchQuery: (q: string) => void
  setActiveFilter: (f: string) => void
}
```

**企業一覧はサーバー状態として React Query で管理し、Zustand には持たない。**

### チャット履歴の永続化

`zustand/middleware` の `persist` を使い、`chatHistories` のみ `localStorage` に保存する。ブラウザリロードで会話が消えない。

```ts
import { persist } from 'zustand/middleware'

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({ /* ... */ }),
    {
      name: 'corplens-storage',
      partialize: (state) => ({ chatHistories: state.chatHistories }),
    }
  )
)
```

---

## 追加ライブラリ

| ライブラリ | 用途 | 理由 |
|---|---|---|
| `zustand` | グローバル State | 軽量、boilerplate 少ない |
| `recharts` | スパークライン・財務チャート | shadcn charts のベースであり保守しやすい |
| `@tanstack/react-query` | データフェッチ・キャッシュ | ローディング・エラー状態を自動管理 |
| `@microsoft/fetch-event-source` | SSE ストリーミング（Phase 3） | POST + カスタムヘッダー対応、EventSource の上位互換 |
| `clsx` + `tailwind-merge` | クラス結合 | shadcn との相性◎ |
| `lucide-react` | アイコン | shadcn と同じアイコンセット |

> **axios は採用しない。** ネイティブ `fetch` + React Query の組み合わせで同等の機能を賄える。SSEには対応していないため採用メリットがない。

---

## ディレクトリ構成（Phase 1）

```
src/
├── app/
│   ├── layout.tsx           # RootLayout
│   ├── page.tsx             # ルートリダイレクト
│   └── [ticker]/
│       └── page.tsx         # 企業詳細ページ（Server Component）
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── TitleBar.tsx
│   │   ├── ActivityBar.tsx
│   │   └── StatusBar.tsx
│   ├── sidebar/
│   │   ├── Sidebar.tsx
│   │   ├── SectorGroup.tsx
│   │   └── CompanyItem.tsx
│   ├── main/
│   │   ├── SearchBar.tsx
│   │   ├── TabBar.tsx
│   │   └── company/
│   │       ├── CompanyDetail.tsx
│   │       ├── CompanyHeader.tsx
│   │       ├── KPIGrid.tsx
│   │       ├── KPICard.tsx
│   │       ├── FinancialCharts.tsx
│   │       └── FinancialTable.tsx
│   └── chat/
│       ├── ChatPanel.tsx
│       ├── MessageList.tsx
│       ├── MessageBubble.tsx
│       └── ChatInput.tsx
├── store/
│   └── appStore.ts
├── lib/
│   ├── api.ts               # fetch ラッパー（ベース URL・エラー処理）
│   └── utils.ts             # clsx + tailwind-merge の cn()
├── data/
│   └── mockCompanies.ts
└── types/
    └── index.ts
```

---

## レスポンシブ方針

**デスクトップ（1280px 以上）専用。** 4ペイン構成はモバイルに最適化しない。就活での利用はPC前提とする。最小幅 `min-w-[1280px]` をルートに設定し、それ以下はスクロールで対応。

---

## 実装フェーズ

| Phase | 内容 | 目標 |
|---|---|---|
| 1 | UIシェル（静的モック） | 全コンポーネントをモックデータで表示。ルーティング `/[ticker]` も実装 |
| 2 | State + API 接続 | Zustand 導入、React Query で FastAPI エンドポイントと疎通。財務データを実データに切り替え |
| 3 | RAG 統合 + Streaming | 有報 RAG チャット、`fetch-event-source` でSSEストリーミング受信 |
