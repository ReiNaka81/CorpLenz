'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { MessageSquare, Menu } from 'lucide-react'
import { TitleBar } from './TitleBar'
import { ActivityBar } from './ActivityBar'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { SearchBar } from '@/components/main/SearchBar'
import { TabBar } from '@/components/main/TabBar'
import { CompanyDetail } from '@/components/main/company/CompanyDetail'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { useAppStore } from '@/store/appStore'
import { tickerToColor } from '@/lib/utils'

export function AppLayout() {
  const { selectedCompany, splitEnabled, rightPaneCompany, activePane, setActivePane, chatOpen, setChatOpen, setCompanies } = useAppStore()

  const [isMobile, setIsMobile] = useState(false)
  const [windowWidth, setWindowWidth] = useState(375)

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      setWindowWidth(w)
      setIsMobile(w < 768)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies`)
      .then((res) => res.json())
      .then((data) => {
        const companies = data.companies.map((c: {
          ticker: string
          name: string
          name_en?: string | null
          sector: string
        }) => ({
          id: c.ticker,
          ticker: c.ticker,
          name: c.name,
          name_en: c.name_en ?? undefined,
          sector: c.sector,
          color: tickerToColor(c.ticker),
        }))
        setCompanies(companies)
      })
      .catch(() => {})
  }, [])

  const [activeItem, setActiveItem] = useState('企業一覧')
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  )
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const [chatWidth, setChatWidth] = useState(320)
  const [splitRatio, setSplitRatio] = useState(0.5)
  const mainRef = useRef<HTMLDivElement>(null)

  // モバイルで企業選択時にサイドバーを閉じる
  useEffect(() => {
    if (isMobile && selectedCompany) {
      setSidebarOpen(false)
    }
  }, [selectedCompany, isMobile])

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
      {isMobile ? '左上のメニューから企業を選択してください' : '左のサイドバーから企業を選択してください'}
    </div>
  )

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--vsc-editor)' }}
    >
      {/* デスクトップのみ TitleBar */}
      <div className="hidden md:block">
        <TitleBar />
      </div>

      {/* モバイルのみ ヘッダーバー */}
      <div
        className="flex items-center px-2 border-b shrink-0 md:hidden"
        style={{
          backgroundColor: 'var(--vsc-sidebar)',
          borderColor: 'var(--vsc-border)',
          paddingTop: 'env(safe-area-inset-top)',
          minHeight: '48px',
        }}
      >
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="flex items-center justify-center w-11 h-11"
          style={{ color: sidebarOpen ? 'var(--vsc-accent)' : 'var(--vsc-text-muted)' }}
        >
          <Menu size={22} />
        </button>
        <span className="flex-1 text-center text-sm font-semibold" style={{ color: 'var(--vsc-text)' }}>
          CorpLens
        </span>
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="flex items-center justify-center w-11 h-11"
          style={{ color: chatOpen ? 'var(--vsc-accent)' : 'var(--vsc-text-muted)' }}
        >
          <MessageSquare size={22} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* デスクトップのみ ActivityBar */}
        <div className="hidden md:flex">
          <ActivityBar activeItem={activeItem} onSelect={handleActivitySelect} />
        </div>

        {/* モバイル: サイドバーをフルスクリーンオーバーレイで表示 */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 z-50 flex flex-col">
            <SearchBar />
            <div className="flex flex-1 min-h-0">
              <Sidebar
                width={windowWidth}
                isOpen={true}
                onToggle={() => setSidebarOpen(false)}
                onWidthChange={() => {}}
              />
            </div>
          </div>
        )}
        {/* モバイル: サイドバー背景オーバーレイ（タップで閉じる） */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* デスクトップ: 通常のサイドバー */}
        {!isMobile && (
          <Sidebar
            width={sidebarWidth}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen((o) => !o)}
            onWidthChange={setSidebarWidth}
          />
        )}

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="hidden md:block">
            <SearchBar />
          </div>
          <div ref={mainRef} className="flex flex-1 overflow-hidden">
            {/* 左ペイン */}
            <div
              className="flex flex-col overflow-hidden"
              style={{ width: splitEnabled && !isMobile ? `${splitRatio * 100}%` : '100%' }}
              onClick={() => setActivePane('left')}
            >
              <TabBar pane="left" isActive={activePane === 'left'} />
              {selectedCompany ? <CompanyDetail company={selectedCompany} /> : emptyState}
            </div>

            {/* 分割ペイン: デスクトップのみ */}
            {splitEnabled && !isMobile && (
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
                  <TabBar pane="right" isActive={activePane === 'right'} />
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
          isMobile={isMobile}
          onToggle={() => setChatOpen(!chatOpen)}
          onWidthChange={setChatWidth}
        />
      </div>

    </div>
  )
}
