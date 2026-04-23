export interface Company {
  id: string
  name: string
  ticker: string
  sector: string
  color: string
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
