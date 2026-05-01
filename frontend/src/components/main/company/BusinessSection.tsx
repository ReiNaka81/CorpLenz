'use client'

import { BusinessSummary } from '@/types'
import { useAppStore } from '@/store/appStore'

interface BusinessSectionProps {
  data: BusinessSummary
}

export function BusinessSection({ data }: BusinessSectionProps) {
  const { setPendingQuestion, setChatOpen } = useAppStore()

  const askLLM = () => {
    setChatOpen(true)
    setPendingQuestion('この企業の事業内容・セグメント構成・競合優位性について詳しく教えてください。')
  }

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

      <div className="space-y-2">
        <span className="text-xs" style={{ color: 'var(--vsc-text-muted)' }}>セグメント別売上構成</span>
        {data.segments.map((seg) => (
          <div key={seg.name} className="space-y-0.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs" style={{ color: 'var(--vsc-text)' }}>
                {seg.name}
              </span>
              <span
                className="text-xs tabular-nums shrink-0"
                style={{ color: seg.revenue_ratio < 0 ? '#f87171' : 'var(--vsc-text-muted)' }}
              >
                {seg.revenue_ratio < 0
                  ? `△${Math.abs(Math.round(seg.revenue_ratio * 100))}%`
                  : `${Math.round(seg.revenue_ratio * 100)}%`}
              </span>
            </div>
            {seg.revenue_ratio >= 0 && (
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--vsc-border)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${seg.revenue_ratio * 100}%`, backgroundColor: 'var(--vsc-accent)' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>


      <div className="space-y-1">
        <span className="text-xs" style={{ color: 'var(--vsc-text-muted)' }}>沿革</span>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--vsc-text)' }}>
          {data.history_highlights}
        </p>
      </div>

      <button
        onClick={askLLM}
        className="text-xs hover:underline transition-colors"
        style={{ color: 'var(--vsc-accent)' }}
      >
        AIアナリストに詳しく聞く →
      </button>
    </div>
  )
}
