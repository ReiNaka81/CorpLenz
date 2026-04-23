'use client'

import { useState } from 'react'
import { TitleBar } from './TitleBar'
import { ActivityBar } from './ActivityBar'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { SearchBar } from '@/components/main/SearchBar'
import { TabBar } from '@/components/main/TabBar'
import { CompanyDetail } from '@/components/main/company/CompanyDetail'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { useAppStore } from '@/store/appStore'

export function AppLayout() {
  const { selectedCompany } = useAppStore()
  const [activeItem, setActiveItem] = useState('企業一覧')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const [chatOpen, setChatOpen] = useState(true)
  const [chatWidth, setChatWidth] = useState(320)

  const handleActivitySelect = (label: string) => {
    if (label === activeItem && label === '企業一覧') {
      setSidebarOpen((o) => !o)
    } else {
      setActiveItem(label)
      if (label === '企業一覧') setSidebarOpen(true)
    }
  }

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
          <TabBar />
          {selectedCompany ? (
            <CompanyDetail company={selectedCompany} />
          ) : (
            <div
              className="flex-1 flex items-center justify-center text-sm"
              style={{ color: 'var(--vsc-text-muted)' }}
            >
              左のサイドバーから企業を選択してください
            </div>
          )}
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
