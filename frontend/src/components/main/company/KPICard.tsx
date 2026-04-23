'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface KPICardProps {
  label: string
  value: string
  sub: string
  trend?: number
}

export function KPICard({ label, value, sub, trend }: KPICardProps) {
  const isPositive = trend !== undefined && trend >= 0

  return (
    <Card
      className="border"
      style={{ backgroundColor: 'var(--vsc-sidebar)', borderColor: 'var(--vsc-border)' }}
    >
      <CardContent className="p-4">
        <p className="text-xs mb-1" style={{ color: 'var(--vsc-text-muted)' }}>
          {label}
        </p>
        <p className="text-xl font-semibold tabular-nums" style={{ color: 'var(--vsc-text)' }}>
          {value}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs" style={{ color: 'var(--vsc-text-muted)' }}>
            {sub}
          </p>
          {trend !== undefined && (
            <span
              className="flex items-center gap-0.5 text-xs font-medium"
              style={{ color: isPositive ? '#4ade80' : '#f87171' }}
            >
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isPositive ? '+' : ''}{trend.toFixed(1)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
