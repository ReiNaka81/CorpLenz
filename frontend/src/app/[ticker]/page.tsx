'use client'

import { useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAppStore } from '@/store/appStore'
import { mockCompanies } from '@/data/mockCompanies'

export default function TickerPage() {
  const { ticker } = useParams<{ ticker: string }>()
  const { setSelectedCompany } = useAppStore()
  const handledTickerRef = useRef<string | null>(null)

  useEffect(() => {
    if (ticker && handledTickerRef.current !== ticker) {
      handledTickerRef.current = ticker
      const found = mockCompanies.find((c) => c.ticker === ticker)
      if (found) setSelectedCompany(found)
    }
  }, [ticker, setSelectedCompany])

  return <AppLayout />
}
