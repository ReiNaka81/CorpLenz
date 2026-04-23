'use client'

import { useState, useRef, useCallback } from 'react'
import { TitleBar } from './TitleBar'
import { ActivityBar } from './ActivityBar'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { SearchBar } from '@/components/main/SearchBar'
import { TabBar } from '@/components/main/TabBar'
import { CompanyDetail } from '@/components/main/company/CompanyDetail'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { useAppStore } from '@/store/appStore'

export function AppLayout() {
  const { selectedCompany, splitEnabled, rightPaneCompany, setActivePane } = useAppStore()
  const [activeItem, setActiveItem] = useState('企業一覧')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const [chatOpen, setChatOpen] = useState(true)
  const [chatWidth, setChatWidth] = useState(320)
  const [splitRatio, setSplitRatio] = useState(0.5)
  const mainRef = useRef<HTMLDivElement>(null)

  const handleActivitySelect = (label: string) => {
    if (label === activeItem && label === '企業一覧') {
      setSidebarOpen((o) => !o)
    } else {
      setActiveItem(label)
      if (label === '企業一覧') setSidebarOpen(true)
    }
  }

  const handleDividerDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const container = mainRef.current
    if (!container) return
    const onMouseMove = (ev: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const ratio = (ev.clientX - rect.left) / rect.width
      setSplitRatio(Math.max(0.2, Math.min(0.8, ratio)))
    }
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [])

  const emptyState = (
    <div
      className="flex-1 flex items-center justify-center text-sm"
      style={{ color: 'var(--vsc-text-muted)' }}
    >
      左のサイドバーから企業を選択してください
    </div>
  )

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--vsc-editor)' }}
    >
      <TitleBar />

      <div className="flex flex-1 overflow-hidden">
        <ActivityBar activeItem={activeItem} onSelect={handleActivitySelect} />
        <Sidebar
          width={sidebarWidth}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
          onWidthChange={setSidebarWidth}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <SearchBar />
          <div ref={mainRef} className="flex flex-1 overflow-hidden">
          {/* 左ペイン */}
          <div
            className="flex flex-col overflow-hidden"
            style={{ width: splitEnabled ? `${splitRatio * 100}%` : '100%' }}
            onClick={() => setActivePane('left')}
          >
            <TabBar pane="left" />
            {selectedCompany ? <CompanyDetail company={selectedCompany} /> : emptyState}
          </div>

          {/* スプリット時：ドラッグ可能な仕切り＋右ペイン */}
          {splitEnabled && (
            <>
              <div
                className="w-1 shrink-0 cursor-col-resize hover:bg-blue-400/50 transition-colors"
                style={{ backgroundColor: 'var(--vsc-border)' }}
                onMouseDown={handleDividerDrag}
              />
              <div
                className="flex flex-col overflow-hidden flex-1"
                onClick={() => setActivePane('right')}
              >
                <TabBar pane="right" />
                {rightPaneCompany ? (
                  <CompanyDetail company={rightPaneCompany} />
                ) : (
                  <div
                    className="flex-1 flex items-center justify-center text-sm"
                    style={{ color: 'var(--vsc-text-muted)' }}
                  >
                    企業を選択してください
                  </div>
                )}
              </div>
            </>
          )}
          </div>
        </div>

        <ChatPanel
          company={selectedCompany}
          width={chatWidth}
          isOpen={chatOpen}
          onToggle={() => setChatOpen((o) => !o)}
          onWidthChange={setChatWidth}
        />
      </div>
    </div>
  )
}
