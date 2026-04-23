'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Company } from '@/types'
import { mockFinancials } from '@/data/mockCompanies'
import { CompanyHeader } from './CompanyHeader'
import { KPIGrid } from './KPIGrid'
import { FinancialCharts } from './FinancialCharts'
import { FinancialTable } from './FinancialTable'

interface CompanyDetailProps {
  company: Company
}

export function CompanyDetail({ company }: CompanyDetailProps) {
  const financials = mockFinancials[company.ticker]

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        <CompanyHeader company={company} />
        {financials ? (
          <>
            <KPIGrid financials={financials} />
            <FinancialCharts financials={financials} companyColor={company.color} />
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
