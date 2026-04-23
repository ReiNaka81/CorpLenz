'use client'

import { BusinessSummary } from '@/types'

interface BusinessSectionProps {
  data: BusinessSummary
}

export function BusinessSection({ data }: BusinessSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--vsc-text-muted)' }}>
          事業概要
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--vsc-border)' }} />
      </div>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--vsc-text)' }}>
        {data.description}
      </p>

      <div className="space-y-1.5">
        <span className="text-xs" style={{ color: 'var(--vsc-text-muted)' }}>セグメント別売上構成</span>
        {data.segments.map((seg) => (
          <div key={seg.name} className="flex items-center gap-2">
            <span className="text-xs w-36 shrink-0 truncate" style={{ color: 'var(--vsc-text)' }}>
              {seg.name}
            </span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--vsc-border)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${seg.revenue_ratio * 100}%`, backgroundColor: 'var(--vsc-accent)' }}
              />
            </div>
            <span className="text-xs tabular-nums w-8 text-right" style={{ color: 'var(--vsc-text-muted)' }}>
              {Math.round(seg.revenue_ratio * 100)}%
            </span>
          </div>
        ))}
      </div>

      <div
        className="flex items-center justify-between rounded-md px-3 py-2"
        style={{ backgroundColor: 'var(--vsc-sidebar)', border: '1px solid var(--vsc-border)' }}
      >
        <span className="text-xs" style={{ color: 'var(--vsc-text-muted)' }}>研究開発費</span>
        <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--vsc-text)' }}>
          {data.rd_expense >= 10000
            ? `${(data.rd_expense / 10000).toFixed(1)} 兆円`
            : `${data.rd_expense.toLocaleString()} 億円`}
        </span>
      </div>

      <div className="space-y-1">
        <span className="text-xs" style={{ color: 'var(--vsc-text-muted)' }}>沿革</span>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--vsc-text)' }}>
          {data.history_highlights}
        </p>
      </div>
    </div>
  )
}
