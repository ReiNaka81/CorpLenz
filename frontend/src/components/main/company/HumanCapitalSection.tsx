'use client'

import { HumanCapital } from '@/types'
import { useAppStore } from '@/store/appStore'

interface StatCardProps {
  label: string
  value: string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div
      className="rounded-md p-3 flex flex-col gap-1"
      style={{ backgroundColor: 'var(--vsc-sidebar)', border: '1px solid var(--vsc-border)' }}
    >
      <span className="text-xs" style={{ color: 'var(--vsc-text-muted)' }}>{label}</span>
      <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--vsc-text)' }}>{value}</span>
    </div>
  )
}

interface HumanCapitalSectionProps {
  data: HumanCapital
}

export function HumanCapitalSection({ data }: HumanCapitalSectionProps) {
  const { setPendingQuestion, setChatOpen } = useAppStore()

  const askLLM = () => {
    setChatOpen(true)
    setPendingQuestion('この企業の人的資本（従業員数・平均年収・勤続年数・女性管理職比率）について詳しく教えてください。')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--vsc-text-muted)' }}>
          人的資本
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--vsc-border)' }} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="連結従業員数"
          value={`${data.employee_count_consolidated.toLocaleString()} 人`}
        />
        <StatCard
          label="単体従業員数"
          value={`${data.employee_count_standalone.toLocaleString()} 人`}
        />
        <StatCard
          label="平均年齢"
          value={`${data.average_age} 歳`}
        />
        <StatCard
          label="平均勤続年数"
          value={`${data.average_tenure} 年`}
        />
        <StatCard
          label="平均年収"
          value={`${data.average_salary.toLocaleString()} 万円`}
        />
      </div>

      <div className="space-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'var(--vsc-text-muted)' }}>女性管理職比率</span>
          <span className="text-xs font-semibold tabular-nums" style={{ color: 'var(--vsc-text)' }}>
            {data.female_manager_ratio > 0 ? `${data.female_manager_ratio}%` : '—'}
          </span>
        </div>
        {data.female_manager_ratio > 0 && (
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--vsc-border)' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.min(data.female_manager_ratio, 100)}%`, backgroundColor: 'var(--vsc-accent)' }}
            />
          </div>
        )}
      </div>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--vsc-text-muted)' }}>
        {data.commentary}
      </p>

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
