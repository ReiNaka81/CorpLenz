'use client'

import { useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { mockCompanies } from '@/data/mockCompanies'
import { useAppStore } from '@/store/appStore'

const sectors = ['すべて', ...Array.from(new Set(mockCompanies.map((c) => c.sector)))]

export function SearchBar() {
  const { searchQuery, activeFilter, setSearchQuery, setActiveFilter } = useAppStore()
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
      className="flex items-center gap-2 px-3 py-2 border-b shrink-0"
      style={{
        backgroundColor: 'var(--vsc-sidebar)',
        borderColor: 'var(--vsc-border)',
      }}
    >
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
          style={{
            backgroundColor: 'var(--vsc-editor)',
            color: 'var(--vsc-text)',
          }}
        />
      </div>
      <div className="flex gap-1">
        {sectors.map((s) => (
          <Button
            key={s}
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter(s)}
            className="h-6 px-2 text-xs rounded-sm"
            style={{
              backgroundColor: activeFilter === s ? 'var(--vsc-accent)' : 'transparent',
              color: activeFilter === s ? '#ffffff' : 'var(--vsc-text-muted)',
            }}
          >
            {s}
          </Button>
        ))}
      </div>
    </div>
  )
}
