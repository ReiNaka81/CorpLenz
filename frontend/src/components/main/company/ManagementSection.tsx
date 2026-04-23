'use client'

import { ManagementSummary } from '@/types'

interface ManagementSectionProps {
  data: ManagementSummary
}

interface TextBlockProps {
  label: string
  text: string
}

function TextBlock({ label, text }: TextBlockProps) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-medium" style={{ color: 'var(--vsc-text-muted)' }}>{label}</span>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--vsc-text)' }}>{text}</p>
    </div>
  )
}

export function ManagementSection({ data }: ManagementSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--vsc-text-muted)' }}>
          将来性・経営課題
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--vsc-border)' }} />
      </div>

      <div
        className="flex items-center justify-between rounded-md px-3 py-2 mb-1"
        style={{ backgroundColor: 'var(--vsc-sidebar)', border: '1px solid var(--vsc-border)' }}
      >
        <span className="text-xs" style={{ color: 'var(--vsc-text-muted)' }}>設備投資額</span>
        <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--vsc-text)' }}>
          {data.capex >= 10000
            ? `${(data.capex / 10000).toFixed(1)} 兆円`
            : `${data.capex.toLocaleString()} 億円`}
        </span>
      </div>

      <TextBlock label="経営方針" text={data.policy} />
      <TextBlock label="対処すべき課題" text={data.challenges} />
      <TextBlock label="事業リスク" text={data.risks} />
    </div>
  )
}
