'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Company } from '@/types'
import { CompanyItem } from './CompanyItem'

interface SectorGroupProps {
  sector: string
  companies: Company[]
  selectedId: string | undefined
  onSelect: (company: Company) => void
}

export function SectorGroup({ sector, companies, selectedId, onSelect }: SectorGroupProps) {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center w-full gap-1 px-2 py-1 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        style={{ color: 'var(--vsc-text-muted)' }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.color = 'var(--vsc-text)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.color = 'var(--vsc-text-muted)'
        }}
      >
        <ChevronRight
          size={12}
          className="transition-transform duration-150"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
        {sector}
      </button>
      {open && (
        <div>
          {companies.map((c) => (
            <CompanyItem
              key={c.id}
              company={c}
              isActive={c.id === selectedId}
              onClick={() => onSelect(c)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
