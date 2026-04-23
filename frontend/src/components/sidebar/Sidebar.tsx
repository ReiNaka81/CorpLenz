'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { mockCompanies } from '@/data/mockCompanies'
import { useAppStore } from '@/store/appStore'
import { SectorGroup } from './SectorGroup'
import { Company } from '@/types'

const MIN_WIDTH = 150
const MAX_WIDTH = 480

interface SidebarProps {
  width: number
  isOpen: boolean
  onToggle: () => void
  onWidthChange: (w: number) => void
}

export function Sidebar({ width, isOpen, onToggle, onWidthChange }: SidebarProps) {
  const router = useRouter()
  const { selectedCompany, setSelectedCompany, searchQuery, activeFilter } = useAppStore()

  const handleSelect = (company: Company) => {
    setSelectedCompany(company)
    router.push(`/${company.ticker}`)
  }

  const filtered = useMemo(() => {
    return mockCompanies.filter((c) => {
      const matchFilter = activeFilter === 'すべて' || c.sector === activeFilter
      const matchSearch =
        searchQuery === '' || c.name.includes(searchQuery) || c.ticker.includes(searchQuery)
      return matchFilter && matchSearch
    })
  }, [searchQuery, activeFilter])

  const bySector = useMemo(() => {
    const map = new Map<string, Company[]>()
    for (const c of filtered) {
      const arr = map.get(c.sector) ?? []
      arr.push(c)
      map.set(c.sector, arr)
    }
    return map
  }, [filtered])

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = width
    const onMouseMove = (ev: MouseEvent) => {
      onWidthChange(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth + ev.clientX - startX)))
    }
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  if (!isOpen) {
    return (
      <div
        className="flex flex-col items-center w-6 shrink-0 border-r cursor-pointer"
        style={{ backgroundColor: 'var(--vsc-sidebar)', borderColor: 'var(--vsc-border)' }}
        onClick={onToggle}
        title="企業一覧を開く"
      >
        <div className="flex items-center justify-center h-8 mt-1" style={{ color: 'var(--vsc-text-muted)' }}>
          <ChevronRight size={14} />
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative flex flex-col shrink-0 border-r"
      style={{
        width,
        backgroundColor: 'var(--vsc-sidebar)',
        borderColor: 'var(--vsc-border)',
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 shrink-0"
        style={{ color: 'var(--vsc-text-muted)' }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider">企業一覧</span>
        <button
          onClick={onToggle}
          className="p-0.5 rounded hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="py-1">
          {Array.from(bySector.entries()).map(([sector, companies]) => (
            <SectorGroup
              key={sector}
              sector={sector}
              companies={companies}
              selectedId={selectedCompany?.id}
              onSelect={handleSelect}
            />
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-4 text-xs" style={{ color: 'var(--vsc-text-muted)' }}>
              該当企業なし
            </p>
          )}
        </div>
      </ScrollArea>

      <div
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400/50 transition-colors z-10"
        onMouseDown={handleDragStart}
      />
    </div>
  )
}
