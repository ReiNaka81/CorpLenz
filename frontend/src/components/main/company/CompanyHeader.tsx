'use client'

import { Users, Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Company, CompanySummary } from '@/types'

interface CompanyHeaderProps {
  company: Company
  summary: CompanySummary | null
}

function getInitial(name: string) {
  return name.charAt(0)
}

function formatEmployees(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万名`
  return `${n.toLocaleString()}名`
}

export function CompanyHeader({ company, summary }: CompanyHeaderProps) {
  return (
    <div
      className="flex items-start gap-4 p-4 rounded-lg border"
      style={{ backgroundColor: 'var(--vsc-sidebar)', borderColor: 'var(--vsc-border)' }}
    >
      <div
        className="flex items-center justify-center w-12 h-12 rounded-lg text-white font-bold text-xl shrink-0"
        style={{ backgroundColor: 'var(--vsc-accent)' }}
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
          {summary && (
            <span className="flex items-center gap-1">
              <Users size={11} />
              {formatEmployees(summary.human_capital.employee_count_consolidated)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Building2 size={11} />
            {company.sector}
          </span>
        </div>
      </div>
    </div>
  )
}
