'use client'

import { CompanyFinancials } from '@/types'
import { KPICard } from './KPICard'

function fmt(n: number | null) {
  if (n === null) return '—'
  if (n >= 10000) return `${(n / 10000).toFixed(1)}兆円`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}千億円`
  return `${n.toFixed(0)}億円`
}

function yoy(curr: number | null, prev: number | null) {
  if (curr === null || prev === null || prev === 0) return undefined
  return ((curr - prev) / Math.abs(prev)) * 100
}

interface KPIGridProps {
  financials: CompanyFinancials
}

export function KPIGrid({ financials }: KPIGridProps) {
  const years = financials.years
  const latest = years[years.length - 1]
  const prev = years[years.length - 2]

  const roe =
    latest.net_profit !== null && latest.equity !== null && latest.equity !== 0
      ? (latest.net_profit / latest.equity) * 100
      : null
  const prevRoe =
    prev && prev.net_profit !== null && prev.equity !== null && prev.equity !== 0
      ? (prev.net_profit / prev.equity) * 100
      : null

  return (
    <div className="grid grid-cols-4 gap-3">
      <KPICard
        label="売上高"
        value={fmt(latest.revenue)}
        sub={`${latest.year}年度`}
        trend={prev ? yoy(latest.revenue, prev.revenue) : undefined}
      />
      <KPICard
        label="純利益"
        value={fmt(latest.net_profit)}
        sub={`${latest.year}年度`}
        trend={prev ? yoy(latest.net_profit, prev.net_profit) : undefined}
      />
      <KPICard
        label="自己資本"
        value={fmt(latest.equity)}
        sub={`${latest.year}年度`}
        trend={prev ? yoy(latest.equity, prev.equity) : undefined}
      />
      <KPICard
        label="ROE"
        value={roe !== null ? `${roe.toFixed(1)}%` : '—'}
        sub=""
        tooltip="当期純利益 / 自己資本"
        trend={roe !== null && prevRoe !== null ? yoy(roe, prevRoe) : undefined}
      />
    </div>
  )
}
