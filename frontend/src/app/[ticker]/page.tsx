'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAppStore } from '@/store/appStore'
import { mockCompanies } from '@/data/mockCompanies'

export default function TickerPage() {
  const { ticker } = useParams<{ ticker: string }>()
  const { setSelectedCompany, selectedCompany } = useAppStore()

  useEffect(() => {
    if (ticker && selectedCompany?.ticker !== ticker) {
      const found = mockCompanies.find((c) => c.ticker === ticker)
      if (found) setSelectedCompany(found)
    }
  }, [ticker, selectedCompany?.ticker, setSelectedCompany])

  return <AppLayout />
}
