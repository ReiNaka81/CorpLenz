import re
from pydantic import BaseModel, field_validator


class ChatRequest(BaseModel):
    query: str    # ユーザーの質問文
    ticker: str   # 対象企業の証券コード（例: "7203"）
    model: str = "claude"  # 使用するモデル（"claude" or "deepseek"）

    @field_validator("query")
    @classmethod
    def validate_query(cls, v: str) -> str:
        if len(v.strip()) == 0:
            raise ValueError("質問が空です")
        if len(v) > 1000:
            raise ValueError("質問は1000文字以内にしてください")
        return v

    @field_validator("ticker")
    @classmethod
    def validate_ticker(cls, v: str) -> str:
        if not re.fullmatch(r"[0-9A-Z]{4,5}", v):
            raise ValueError("tickerは4〜5桁の英数字である必要があります")
        return v


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
    ticker: str              # 証券コード
    name: str                # 会社名
    name_en: str | None = None  # 英語会社名
    sector: str              # 業種


class CompaniesResponse(BaseModel):
    companies: list[CompanyItem]
