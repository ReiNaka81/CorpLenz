'use client'

export const runtime = 'edge'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAppStore } from '@/store/appStore'

export default function TickerPage() {
  const { ticker } = useParams<{ ticker: string }>()
  const { companies, setSelectedCompany } = useAppStore()

  useEffect(() => {
    if (!ticker || companies.length === 0) return
    const found = companies.find((c) => c.ticker === ticker)
    if (found) setSelectedCompany(found)
  }, [ticker, companies, setSelectedCompany])

  return <AppLayout />
}
