'use client'

import { X } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

export function TabBar() {
  const { openTabs, selectedCompany, setSelectedCompany, closeTab } = useAppStore()

  if (openTabs.length === 0) return null

  return (
    <div
      className="flex items-end overflow-x-auto shrink-0 border-b"
      style={{
        backgroundColor: 'var(--vsc-tab-inactive)',
        borderColor: 'var(--vsc-border)',
      }}
    >
      {openTabs.map((tab) => {
        const isActive = tab.id === selectedCompany?.id
        return (
          <div
            key={tab.id}
            className="flex items-center gap-1.5 px-3 h-9 text-xs whitespace-nowrap cursor-pointer shrink-0 border-r group transition-colors"
            style={{
              backgroundColor: isActive ? 'var(--vsc-tab-active)' : 'var(--vsc-tab-inactive)',
              color: isActive ? 'var(--vsc-text)' : 'var(--vsc-text-muted)',
              borderColor: 'var(--vsc-border)',
              borderTop: isActive ? `1px solid var(--vsc-accent)` : '1px solid transparent',
            }}
            onClick={() => setSelectedCompany(tab)}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: tab.color }}
            />
            <span>{tab.name}</span>
            <span style={{ color: 'var(--vsc-text-muted)' }}>{tab.ticker}</span>
            <button
              className="flex items-center justify-center w-4 h-4 rounded-sm opacity-0 group-hover:opacity-100 hover:!opacity-100 transition-opacity"
              style={{ color: 'var(--vsc-text-muted)' }}
              onClick={(e) => {
                e.stopPropagation()
                closeTab(tab.id)
              }}
            >
              <X size={12} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
