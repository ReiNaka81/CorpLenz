'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { X, Columns2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

interface TabBarProps {
  pane: 'left' | 'right'
  isActive?: boolean
}

export function TabBar({ pane, isActive = false }: TabBarProps) {
  const {
    openTabs, selectedCompany, setSelectedCompany, closeTab,
    rightPaneTabs, rightPaneCompany, setRightPaneCompany, closeRightPaneTab,
    splitEnabled, toggleSplit, setActivePane,
  } = useAppStore()

  const tabs = pane === 'left' ? openTabs : rightPaneTabs
  const activeCompany = pane === 'left' ? selectedCompany : rightPaneCompany
  const onSelect = pane === 'left' ? setSelectedCompany : setRightPaneCompany
  const onClose = pane === 'left' ? closeTab : closeRightPaneTab

  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState)
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [tabs, updateScrollState])

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -120 : 120, behavior: 'smooth' })
  }

  if (tabs.length === 0) return null

  return (
    <div
      className="flex items-end shrink-0 border-b"
      style={{
        backgroundColor: 'var(--vsc-tab-inactive)',
        borderColor: 'var(--vsc-border)',
        boxShadow: isActive ? 'inset 0 2px 0 var(--vsc-accent)' : 'none',
      }}
      onClick={() => setActivePane(pane)}
    >
      {/* 左スクロール矢印 */}
      {canScrollLeft && (
        <button
          className="flex items-center justify-center w-6 h-9 shrink-0 transition-colors hover:text-white"
          style={{ color: 'var(--vsc-text-muted)' }}
          onClick={(e) => { e.stopPropagation(); scroll('left') }}
        >
          <ChevronLeft size={14} />
        </button>
      )}

      <div ref={scrollRef} className="flex items-end flex-1 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
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
                className="flex items-center justify-center w-5 h-5 rounded-sm transition-opacity md:opacity-0 md:group-hover:opacity-100"
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

      {/* 右スクロール矢印 */}
      {canScrollRight && (
        <button
          className="flex items-center justify-center w-6 h-9 shrink-0 transition-colors hover:text-white"
          style={{ color: 'var(--vsc-text-muted)' }}
          onClick={(e) => { e.stopPropagation(); scroll('right') }}
        >
          <ChevronRight size={14} />
        </button>
      )}

      {((pane === 'left' && !splitEnabled) || (pane === 'right' && splitEnabled)) && (
        <button
          className="hidden md:flex items-center justify-center w-9 h-9 shrink-0 border-l transition-colors hover:text-white"
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
