'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Company, Message } from '@/types'

interface AppStore {
  companies: Company[]
  setCompanies: (companies: Company[]) => void

  selectedCompany: Company | null
  openTabs: Company[]
  setSelectedCompany: (company: Company) => void
  closeTab: (id: string) => void

  splitEnabled: boolean
  activePane: 'left' | 'right'
  rightPaneCompany: Company | null
  rightPaneTabs: Company[]
  toggleSplit: () => void
  setRightPaneCompany: (company: Company) => void
  closeRightPaneTab: (id: string) => void
  setActivePane: (pane: 'left' | 'right') => void

  chatHistories: Record<string, Message[]>
  addMessage: (companyId: string, message: Message) => void

  chatOpen: boolean
  setChatOpen: (open: boolean) => void
  pendingQuestion: string | null
  setPendingQuestion: (q: string | null) => void

  searchQuery: string
  activeFilters: string[]
  setSearchQuery: (q: string) => void
  toggleFilter: (sector: string) => void
  clearFilters: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      companies: [],
      setCompanies: (companies) => set({ companies }),

      selectedCompany: null,
      openTabs: [],
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
        if (tabs.length === 0 && get().splitEnabled) {
          // 右ペインを左に昇格
          set({
            openTabs: get().rightPaneTabs,
            selectedCompany: get().rightPaneCompany,
            splitEnabled: false,
            rightPaneTabs: [],
            rightPaneCompany: null,
            activePane: 'left',
          })
        } else {
          set({
            openTabs: tabs,
            selectedCompany:
              selected?.id === id ? (tabs[tabs.length - 1] ?? null) : selected,
          })
        }
      },

      splitEnabled: false,
      activePane: 'left',
      rightPaneCompany: null,
      rightPaneTabs: [],
      toggleSplit: () => {
        const { splitEnabled, selectedCompany } = get()
        if (!splitEnabled) {
          set({
            splitEnabled: true,
            rightPaneCompany: selectedCompany,
            rightPaneTabs: selectedCompany ? [selectedCompany] : [],
            activePane: 'right',
          })
        } else {
          set({ splitEnabled: false, rightPaneCompany: null, rightPaneTabs: [], activePane: 'left' })
        }
      },
      setRightPaneCompany: (company) => {
        const tabs = get().rightPaneTabs
        const alreadyOpen = tabs.some((t) => t.id === company.id)
        set({
          rightPaneCompany: company,
          rightPaneTabs: alreadyOpen ? tabs : [...tabs, company],
        })
      },
      closeRightPaneTab: (id) => {
        const tabs = get().rightPaneTabs.filter((t) => t.id !== id)
        const selected = get().rightPaneCompany
        if (tabs.length === 0) {
          set({ splitEnabled: false, rightPaneTabs: [], rightPaneCompany: null, activePane: 'left' })
        } else {
          set({
            rightPaneTabs: tabs,
            rightPaneCompany: selected?.id === id ? (tabs[tabs.length - 1] ?? null) : selected,
          })
        }
      },
      setActivePane: (pane) => set({ activePane: pane }),

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

      chatOpen: true,
      setChatOpen: (open) => set({ chatOpen: open }),
      pendingQuestion: null,
      setPendingQuestion: (q) => set({ pendingQuestion: q }),

      searchQuery: '',
      activeFilters: [],
      setSearchQuery: (q) => set({ searchQuery: q }),
      toggleFilter: (sector) => {
        const filters = get().activeFilters
        set({
          activeFilters: filters.includes(sector)
            ? filters.filter((f) => f !== sector)
            : [...filters, sector],
        })
      },
      clearFilters: () => set({ activeFilters: [] }),
    }),
    {
      name: 'corplens-storage',
      partialize: (state) => ({ chatHistories: state.chatHistories }),
    }
  )
)
