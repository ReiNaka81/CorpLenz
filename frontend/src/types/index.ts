export interface Company {
  id: string
  name: string
  ticker: string
  sector: string
  color: string
}

export interface Segment {
  name: string
  revenue_ratio: number  // 0〜1
}

export interface HumanCapital {
  employee_count_consolidated: number
  employee_count_standalone: number
  average_age: number
  average_tenure: number
  average_salary: number  // 万円
  female_manager_ratio: number  // %
  commentary: string
}

export interface BusinessSummary {
  description: string
  segments: Segment[]
  rd_expense: number  // 億円
  history_highlights: string
}

export interface ManagementSummary {
  policy: string
  challenges: string
  risks: string
  capex: number  // 億円
}

export interface CompanySummary {
  human_capital: HumanCapital
  business: BusinessSummary
  management: ManagementSummary
}

export interface FinancialYear {
  year: number
  revenue: number
  net_profit: number
  equity: number
  total_assets: number
}

export interface CompanyFinancials {
  ticker: string
  years: FinancialYear[]
}

export interface Message {
  role: 'ai' | 'user'
  content: string
  timestamp: Date
}
