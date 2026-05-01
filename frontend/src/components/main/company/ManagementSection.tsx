'use client'

import { ManagementSummary } from '@/types'
import { useAppStore } from '@/store/appStore'

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
  const { setPendingQuestion, setChatOpen } = useAppStore()

  const askLLM = () => {
    setChatOpen(true)
    setPendingQuestion('この企業の経営方針・課題・リスクについて詳しく教えてください。')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--vsc-text-muted)' }}>
          将来性・経営課題
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--vsc-border)' }} />
      </div>


      <TextBlock label="経営方針" text={data.policy} />
      <TextBlock label="対処すべき課題" text={data.challenges} />
      <TextBlock label="事業リスク" text={data.risks} />

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
