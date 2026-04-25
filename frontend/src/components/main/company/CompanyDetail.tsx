'use client'

import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Company, CompanyFinancials, CompanySummary } from '@/types'
import { CompanyHeader } from './CompanyHeader'
import { HumanCapitalSection } from './HumanCapitalSection'
import { BusinessSection } from './BusinessSection'
import { ManagementSection } from './ManagementSection'
import { KPIGrid } from './KPIGrid'
import { FinancialCharts } from './FinancialCharts'
import { FinancialTable } from './FinancialTable'

interface CompanyDetailProps {
  company: Company
}

export function CompanyDetail({ company }: CompanyDetailProps) {
  const [summary, setSummary] = useState<CompanySummary | null>(null)
  const [financials, setFinancials] = useState<CompanyFinancials | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSummary(null)
    setFinancials(null)
    setLoading(true)

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company?ticker=${company.ticker}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found')
        return res.json()
      })
      .then((data) => {
        setSummary(data.summary)
        setFinancials({ ticker: company.ticker, years: data.financials })
      })
      .catch(() => {
        setSummary(null)
        setFinancials(null)
      })
      .finally(() => setLoading(false))
  }, [company.ticker])

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="p-4 space-y-6">
        <CompanyHeader company={company} summary={summary} />

        {loading ? (
          <div className="text-xs py-2" style={{ color: 'var(--vsc-text-muted)' }}>
            読み込み中...
          </div>
        ) : summary ? (
          <>
            <HumanCapitalSection data={summary.human_capital} />
            <BusinessSection data={summary.business} />
            <ManagementSection data={summary.management} />
          </>
        ) : (
          <div className="text-xs py-2" style={{ color: 'var(--vsc-text-muted)' }}>
            企業サマリーは準備中です
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--vsc-text-muted)' }}>
            財務
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--vsc-border)' }} />
        </div>

        {financials ? (
          <>
            <KPIGrid financials={financials} />
            <FinancialCharts financials={financials} companyColor="#0078d4" />
            <FinancialTable financials={financials} />
          </>
        ) : (
          <div className="flex items-center justify-center h-40 text-sm" style={{ color: 'var(--vsc-text-muted)' }}>
            財務データを読み込み中...
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
