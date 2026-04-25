from pydantic import BaseModel


class ChatRequest(BaseModel):
    query: str    # ユーザーの質問文
    ticker: str   # 対象企業の証券コード（例: "7203"）


class Segment(BaseModel):
    name: str              # セグメント名（例: "自動車"）
    revenue_ratio: float   # 売上構成比（0〜1）


class HumanCapital(BaseModel):
    employee_count_consolidated: int   # 連結従業員数（人）
    employee_count_standalone: int     # 単体従業員数（人）
    average_age: float                 # 平均年齢（歳）
    average_tenure: float              # 平均勤続年数（年）
    average_salary: int                # 平均年収（万円）
    female_manager_ratio: float        # 女性管理職比率（%）
    commentary: str                    # LLMが生成した人的資本の総評


class BusinessSummary(BaseModel):
    description: str          # 事業内容の要約
    segments: list[Segment]   # セグメント別売上構成
    history_highlights: str   # 沿革のハイライト


class ManagementSummary(BaseModel):
    policy: str      # 経営方針
    challenges: str  # 対処すべき課題
    risks: str       # 主要な事業リスク


class CompanySummary(BaseModel):
    human_capital: HumanCapital    # 人的資本セクション
    business: BusinessSummary      # 事業概要セクション
    management: ManagementSummary  # 経営・将来性セクション


class FinancialYear(BaseModel):
    year: int                # 年度（例: 2026）
    revenue: int | None      # 売上高（億円）。銀行など業種によりNoneの場合あり
    net_profit: int | None   # 純利益（億円）
    equity: int | None       # 純資産（億円）
    total_assets: int | None # 総資産（億円）


class SummaryResponse(BaseModel):
    name: str                        # 会社名
    sector: str                      # 業種
    summary: CompanySummary          # LLM生成の企業サマリー
    financials: list[FinancialYear]  # XBRLから取得した財務データ（最大5年分）

class CompanyItem(BaseModel):
    ticker: str  # 証券コード
    name: str    # 会社名
    sector: str  # 業種


class CompaniesResponse(BaseModel):
    companies: list[CompanyItem]