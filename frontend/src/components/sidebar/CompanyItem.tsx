'use client'

import { Company } from '@/types'

interface CompanyItemProps {
  company: Company
  isActive: boolean
  onClick: () => void
}

export function CompanyItem({ company, isActive, onClick }: CompanyItemProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center w-full gap-2 px-4 py-1.5 text-left text-sm transition-colors cursor-pointer"
      style={{
        backgroundColor: isActive ? 'var(--vsc-selection)' : 'transparent',
        color: isActive ? '#ffffff' : 'var(--vsc-text)',
      }}
      onMouseEnter={(e) => {
        if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--vsc-hover)'
      }}
      onMouseLeave={(e) => {
        if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
      }}
    >
      {isActive && (
        <span
          className="absolute left-0 top-0 h-full w-0.5"
          style={{ backgroundColor: 'var(--vsc-accent)' }}
        />
      )}
      <span
        className="w-0.5 h-3.5 rounded-full shrink-0"
        style={{ backgroundColor: 'var(--vsc-text-muted)' }}
      />
      <span className="flex-1 truncate">{company.name}</span>
      <span className="text-xs shrink-0" style={{ color: 'var(--vsc-text-muted)' }}>
        {company.ticker}
      </span>
    </button>
  )
}
