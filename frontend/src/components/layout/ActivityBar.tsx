'use client'

import { Building2, Search, GitCompare, Bookmark, Settings } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const topItems = [
  { icon: Building2, label: '企業一覧' },
  { icon: Search, label: '検索' },
  { icon: GitCompare, label: '比較' },
  { icon: Bookmark, label: 'ウォッチリスト' },
]

interface ActivityBarProps {
  activeItem?: string
  onSelect?: (label: string) => void
}

export function ActivityBar({ activeItem = '企業一覧', onSelect }: ActivityBarProps) {
  return (
    <div
      className="flex flex-col items-center w-12 shrink-0 py-2 gap-1"
      style={{ backgroundColor: 'var(--vsc-activity-bar)' }}
    >
      <div className="flex flex-col items-center gap-1 flex-1">
        {topItems.map(({ icon: Icon, label }) => (
          <Tooltip key={label}>
            <TooltipTrigger
              onClick={() => onSelect?.(label)}
              className="relative flex items-center justify-center w-12 h-12 cursor-pointer transition-colors bg-transparent border-0"
              style={{ color: activeItem === label ? '#ffffff' : '#858585' }}
            >
              {activeItem === label && (
                <span
                  className="absolute left-0 top-0 h-full w-0.5"
                  style={{ backgroundColor: 'var(--vsc-accent)' }}
                />
              )}
              <Icon size={22} />
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <Tooltip>
        <TooltipTrigger
          className="flex items-center justify-center w-12 h-12 cursor-pointer transition-colors bg-transparent border-0"
          style={{ color: '#858585' }}
        >
          <Settings size={22} />
        </TooltipTrigger>
        <TooltipContent side="right">設定</TooltipContent>
      </Tooltip>
    </div>
  )
}
