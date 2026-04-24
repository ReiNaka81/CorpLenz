'use client'

import { X, Columns2 } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

interface TabBarProps {
  pane: 'left' | 'right'
}

export function TabBar({ pane }: TabBarProps) {
  const {
    openTabs, selectedCompany, setSelectedCompany, closeTab,
    rightPaneTabs, rightPaneCompany, setRightPaneCompany, closeRightPaneTab,
    splitEnabled, toggleSplit, setActivePane,
  } = useAppStore()

  const tabs = pane === 'left' ? openTabs : rightPaneTabs
  const activeCompany = pane === 'left' ? selectedCompany : rightPaneCompany
  const onSelect = pane === 'left' ? setSelectedCompany : setRightPaneCompany
  const onClose = pane === 'left' ? closeTab : closeRightPaneTab

  if (tabs.length === 0) return null

  return (
    <div
      className="flex items-end shrink-0 border-b"
      style={{ backgroundColor: 'var(--vsc-tab-inactive)', borderColor: 'var(--vsc-border)' }}
      onClick={() => setActivePane(pane)}
    >
      <div className="flex items-end flex-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeCompany?.id
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
              onClick={() => onSelect(tab)}
            >
              <span
                className="w-0.5 h-3.5 rounded-full shrink-0"
                style={{ backgroundColor: 'var(--vsc-text-muted)' }}
              />
              <span>{tab.name}</span>
              <span style={{ color: 'var(--vsc-text-muted)' }}>{tab.ticker}</span>
              <button
                className="flex items-center justify-center w-4 h-4 rounded-sm opacity-0 group-hover:opacity-100 hover:!opacity-100 transition-opacity"
                style={{ color: 'var(--vsc-text-muted)' }}
                onClick={(e) => {
                  e.stopPropagation()
                  onClose(tab.id)
                }}
              >
                <X size={12} />
              </button>
            </div>
          )
        })}
      </div>

      {pane === 'left' && (
        <button
          className="flex items-center justify-center w-9 h-9 shrink-0 border-l transition-colors hover:text-white"
          style={{
            color: splitEnabled ? 'var(--vsc-text)' : 'var(--vsc-text-muted)',
            borderColor: 'var(--vsc-border)',
          }}
          onClick={(e) => {
            e.stopPropagation()
            toggleSplit()
          }}
          title={splitEnabled ? 'スプリットを閉じる' : '分割表示'}
        >
          <Columns2 size={14} />
        </button>
      )}
    </div>
  )
}
