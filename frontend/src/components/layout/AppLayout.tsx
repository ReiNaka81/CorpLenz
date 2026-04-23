'use client'

import { useState } from 'react'
import { TitleBar } from './TitleBar'
import { ActivityBar } from './ActivityBar'
import { StatusBar } from './StatusBar'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { SearchBar } from '@/components/main/SearchBar'
import { TabBar } from '@/components/main/TabBar'
import { CompanyDetail } from '@/components/main/company/CompanyDetail'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { useAppStore } from '@/store/appStore'

export function AppLayout() {
  const { selectedCompany } = useAppStore()
  const [activeItem, setActiveItem] = useState('企業一覧')

  return (
    <div
      className="flex flex-col h-screen min-w-[1280px] overflow-hidden"
      style={{ backgroundColor: 'var(--vsc-editor)' }}
    >
      <TitleBar />

      <div className="flex flex-1 overflow-hidden">
        <ActivityBar activeItem={activeItem} onSelect={setActiveItem} />
        <Sidebar />

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

        <ChatPanel company={selectedCompany} />
      </div>

      <StatusBar />
    </div>
  )
}
