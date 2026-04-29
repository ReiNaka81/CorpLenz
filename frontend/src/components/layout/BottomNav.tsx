'use client'

import { Building2, Bookmark } from 'lucide-react'

interface BottomNavProps {
  sidebarOpen: boolean
  onSidebarToggle: () => void
}

export function BottomNav({ sidebarOpen, onSidebarToggle }: BottomNavProps) {
  const items = [
    { icon: Building2, label: '企業一覧', active: sidebarOpen, onClick: onSidebarToggle, disabled: false },
    { icon: Bookmark, label: 'ウォッチリスト', active: false, onClick: () => {}, disabled: true },
  ]

  return (
    <div
      className="flex items-center border-t shrink-0"
      style={{
        backgroundColor: 'var(--vsc-activity-bar)',
        borderColor: 'var(--vsc-border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {items.map(({ icon: Icon, label, active, onClick, disabled }) => (
        <button
          key={label}
          onClick={onClick}
          disabled={disabled}
          className="flex flex-col items-center justify-center flex-1 py-3 gap-1 border-0 bg-transparent min-h-[52px]"
          style={{
            color: active ? 'var(--vsc-accent)' : 'var(--vsc-text-muted)',
            opacity: disabled ? 0.4 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          <Icon size={22} />
          <span className="text-xs">{label}</span>
        </button>
      ))}
    </div>
  )
}
