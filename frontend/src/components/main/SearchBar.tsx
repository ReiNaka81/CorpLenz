'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/appStore'

export function SearchBar() {
  const { companies, searchQuery, activeFilters, setSearchQuery, toggleFilter, clearFilters } = useAppStore()
  const [showFilter, setShowFilter] = useState(false)
  const sectors = useMemo(
    () => Array.from(new Set(companies.map((c) => c.sector))),
    [companies]
  )
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div
      className="flex flex-col shrink-0 border-b"
      style={{ backgroundColor: 'var(--vsc-sidebar)', borderColor: 'var(--vsc-border)' }}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--vsc-text-muted)' }}
          />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="企業名・証券コードで検索 (⌘K)"
            className="pl-8 h-7 text-xs border-0 focus-visible:ring-1"
            style={{ backgroundColor: 'var(--vsc-editor)', color: 'var(--vsc-text)' }}
          />
        </div>
        <button
          className="flex items-center justify-center w-7 h-7 rounded-sm transition-colors"
          style={{
            color: showFilter ? 'var(--vsc-accent)' : 'var(--vsc-text-muted)',
            backgroundColor: showFilter ? 'var(--vsc-hover)' : 'transparent',
          }}
          onClick={() => setShowFilter((v) => !v)}
          title="業種フィルター"
        >
          <SlidersHorizontal size={14} />
        </button>
      </div>

      {showFilter && (
        <div className="flex flex-wrap gap-1 px-3 pb-2">
            <Button
              key="すべて"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs rounded-sm"
              style={{
                backgroundColor: activeFilters.length === 0 ? 'var(--vsc-accent)' : 'transparent',
                color: activeFilters.length === 0 ? '#ffffff' : 'var(--vsc-text-muted)',
              }}
            >
              すべて
            </Button>
          {sectors.map((s) => (
            <Button
              key={s}
              variant="ghost"
              size="sm"
              onClick={() => toggleFilter(s)}
              className="h-6 px-2 text-xs rounded-sm"
              style={{
                backgroundColor: activeFilters.includes(s) ? 'var(--vsc-accent)' : 'transparent',
                color: activeFilters.includes(s) ? '#ffffff' : 'var(--vsc-text-muted)',
              }}
            >
              {s}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
