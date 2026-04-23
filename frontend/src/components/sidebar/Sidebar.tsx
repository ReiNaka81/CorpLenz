'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { mockCompanies } from '@/data/mockCompanies'
import { useAppStore } from '@/store/appStore'
import { SectorGroup } from './SectorGroup'
import { Company } from '@/types'

export function Sidebar() {
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
        searchQuery === '' ||
        c.name.includes(searchQuery) ||
        c.ticker.includes(searchQuery)
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

  return (
    <div
      className="flex flex-col w-60 shrink-0 border-r"
      style={{
        backgroundColor: 'var(--vsc-sidebar)',
        borderColor: 'var(--vsc-border)',
      }}
    >
      <div
        className="px-4 py-2 text-xs font-semibold uppercase tracking-wider shrink-0"
        style={{ color: 'var(--vsc-text-muted)' }}
      >
        企業一覧
      </div>
      <ScrollArea className="flex-1">
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
    </div>
  )
}
