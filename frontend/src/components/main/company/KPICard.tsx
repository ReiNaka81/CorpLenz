'use client'

import { CircleHelp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface KPICardProps {
  label: string
  value: string
  sub: string
  trend?: number
  tooltip?: string
}

export function KPICard({ label, value, sub, trend, tooltip }: KPICardProps) {
  const isPositive = trend !== undefined && trend >= 0

  return (
    <Card
      className="border"
      style={{ backgroundColor: 'var(--vsc-sidebar)', borderColor: 'var(--vsc-border)' }}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-1 mb-1">
          <p className="text-xs" style={{ color: 'var(--vsc-text-muted)' }}>
            {label}
          </p>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger>
                <CircleHelp size={11} style={{ color: 'var(--vsc-text-muted)', cursor: 'help' }} />
              </TooltipTrigger>
              <TooltipContent side="top">{tooltip}</TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className="text-xl font-semibold tabular-nums" style={{ color: 'var(--vsc-text)' }}>
          {value}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs" style={{ color: 'var(--vsc-text-muted)' }}>
            {sub}
          </p>
          {trend !== undefined && (
            <span
              className="text-xs font-medium"
              style={{ color: isPositive ? '#34d399' : '#f87171' }}
            >
              前年比 {isPositive ? '+' : ''}{trend.toFixed(1)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
