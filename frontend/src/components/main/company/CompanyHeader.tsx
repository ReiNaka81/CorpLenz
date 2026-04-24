'use client'

import { MapPin, Users, Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Company } from '@/types'

const companyMeta: Record<string, { location: string; employees: string; industry: string }> = {
  '7203': { location: '愛知県豊田市', employees: '375,235名', industry: '自動車製造' },
  '6758': { location: '東京都港区', employees: '113,000名', industry: '電気機器' },
  '6501': { location: '東京都千代田区', employees: '280,000名', industry: '電気機器' },
  '4307': { location: '東京都千代田区', employees: '13,000名', industry: 'ITサービス' },
  '9613': { location: '東京都江東区', employees: '195,000名', industry: '情報通信' },
  '9984': { location: '東京都港区', employees: '53,773名', industry: 'IT投資' },
  '6861': { location: '大阪府大阪市', employees: '10,975名', industry: '計測・制御機器' },
  '6954': { location: '山梨県忍野村', employees: '8,249名', industry: 'FA機器' },
  '8306': { location: '東京都千代田区', employees: '120,000名', industry: '銀行業' },
  '8035': { location: '東京都港区', employees: '15,100名', industry: '半導体製造装置' },
}

interface CompanyHeaderProps {
  company: Company
}

function getInitial(name: string) {
  return name.charAt(0)
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  const meta = companyMeta[company.ticker] ?? {
    location: '—',
    employees: '—',
    industry: '—',
  }

  return (
    <div
      className="flex items-start gap-4 p-4 rounded-lg border"
      style={{ backgroundColor: 'var(--vsc-sidebar)', borderColor: 'var(--vsc-border)' }}
    >
      <div
        className="flex items-center justify-center w-12 h-12 rounded-lg text-white font-bold text-xl shrink-0"
        style={{ backgroundColor: company.color }}
      >
        {getInitial(company.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-lg font-semibold" style={{ color: 'var(--vsc-text)' }}>
            {company.name}
          </h1>
          <Badge
            variant="outline"
            className="text-xs font-mono"
            style={{ borderColor: 'var(--vsc-border)', color: 'var(--vsc-text-muted)' }}
          >
            {company.ticker}.T
          </Badge>
        </div>
        <div className="flex items-center gap-4 mt-1 text-xs flex-wrap" style={{ color: 'var(--vsc-text-muted)' }}>
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {meta.location}
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} />
            {meta.employees}
          </span>
          <span className="flex items-center gap-1">
            <Building2 size={11} />
            {meta.industry}
          </span>
        </div>
      </div>
    </div>
  )
}
