'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CompanyFinancials } from '@/types'

function fmt(n: number | null) {
  if (n === null) return '—'
  return n.toLocaleString('ja-JP')
}

function yoyPct(curr: number | null, prev: number | null) {
  if (curr === null || prev === null || prev === 0) return null
  return ((curr - prev) / Math.abs(prev)) * 100
}

interface FinancialTableProps {
  financials: CompanyFinancials
}

export function FinancialTable({ financials }: FinancialTableProps) {
  const years = financials.years

  type Row = {
    label: string
    key: keyof Omit<typeof years[0], 'year'>
  }

  const rows: Row[] = [
    { label: '売上高 (億円)', key: 'revenue' },
    { label: '純利益 (億円)', key: 'net_profit' },
    { label: '総資産 (億円)', key: 'total_assets' },
    { label: '純資産 (億円)', key: 'equity' },
  ]

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: 'var(--vsc-border)' }}
    >
      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: 'var(--vsc-activity-bar)', borderColor: 'var(--vsc-border)' }}>
            <TableHead className="text-xs w-40" style={{ color: 'var(--vsc-text-muted)' }}>
              項目
            </TableHead>
            {years.map((y) => (
              <TableHead
                key={y.year}
                className="text-xs text-right"
                style={{ color: 'var(--vsc-text-muted)' }}
              >
                {y.year}年
              </TableHead>
            ))}
            <TableHead className="text-xs text-right" style={{ color: 'var(--vsc-text-muted)' }}>
              前年比
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const latest = years[years.length - 1][row.key]
            const prev = years[years.length - 2]?.[row.key]
            const pct = prev !== undefined ? yoyPct(latest, prev) : null

            return (
              <TableRow
                key={row.label}
                className="transition-colors"
                style={{
                  backgroundColor: 'var(--vsc-sidebar)',
                  borderColor: 'var(--vsc-border)',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--vsc-hover)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--vsc-sidebar)'
                }}
              >
                <TableCell className="text-xs font-medium" style={{ color: 'var(--vsc-text)' }}>
                  {row.label}
                </TableCell>
                {years.map((y) => (
                  <TableCell
                    key={y.year}
                    className="text-xs text-right tabular-nums"
                    style={{ color: 'var(--vsc-text)' }}
                  >
                    {fmt(y[row.key])}
                  </TableCell>
                ))}
                <TableCell
                  className="text-xs text-right tabular-nums font-medium"
                  style={{
                    color:
                      pct === null ? 'var(--vsc-text-muted)' : pct >= 0 ? '#34d399' : '#f87171',
                  }}
                >
                  {pct !== null ? `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%` : '—'}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
