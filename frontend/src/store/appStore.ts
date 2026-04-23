'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Company, Message } from '@/types'
import { mockCompanies } from '@/data/mockCompanies'

interface AppStore {
  selectedCompany: Company | null
  openTabs: Company[]
  setSelectedCompany: (company: Company) => void
  closeTab: (id: string) => void

  chatHistories: Record<string, Message[]>
  addMessage: (companyId: string, message: Message) => void

  searchQuery: string
  activeFilter: string
  setSearchQuery: (q: string) => void
  setActiveFilter: (f: string) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      selectedCompany: mockCompanies[0],
      openTabs: [mockCompanies[0]],
      setSelectedCompany: (company) => {
        const tabs = get().openTabs
        const alreadyOpen = tabs.some((t) => t.id === company.id)
        set({
          selectedCompany: company,
          openTabs: alreadyOpen ? tabs : [...tabs, company],
        })
      },
      closeTab: (id) => {
        const tabs = get().openTabs.filter((t) => t.id !== id)
        const selected = get().selectedCompany
        set({
          openTabs: tabs,
          selectedCompany:
            selected?.id === id ? (tabs[tabs.length - 1] ?? null) : selected,
        })
      },

      chatHistories: {},
      addMessage: (companyId, message) => {
        const histories = get().chatHistories
        set({
          chatHistories: {
            ...histories,
            [companyId]: [...(histories[companyId] ?? []), message],
          },
        })
      },

      searchQuery: '',
      activeFilter: 'すべて',
      setSearchQuery: (q) => set({ searchQuery: q }),
      setActiveFilter: (f) => set({ activeFilter: f }),
    }),
    {
      name: 'corplens-storage',
      partialize: (state) => ({ chatHistories: state.chatHistories }),
    }
  )
)
