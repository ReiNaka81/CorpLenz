'use client'

import { useState } from 'react'
import { Company, Message } from '@/types'
import { useAppStore } from '@/store/appStore'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'

interface ChatPanelProps {
  company: Company | null
}

export function ChatPanel({ company }: ChatPanelProps) {
  const { chatHistories, addMessage } = useAppStore()
  const [loading, setLoading] = useState(false)

  const messages: Message[] = company ? (chatHistories[company.id] ?? []) : []

  const handleSend = async (text: string) => {
    if (!company) return

    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() }
    addMessage(company.id, userMsg)
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, ticker: company.ticker }),
      })
      const data = await res.json()
      const aiMsg: Message = {
        role: 'ai',
        content: data.answer ?? 'エラーが発生しました',
        timestamp: new Date(),
      }
      addMessage(company.id, aiMsg)
    } catch {
      const errMsg: Message = {
        role: 'ai',
        content: 'バックエンドに接続できませんでした。サーバーが起動しているか確認してください。',
        timestamp: new Date(),
      }
      addMessage(company.id, errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex flex-col w-80 shrink-0 border-l"
      style={{
        backgroundColor: 'var(--vsc-sidebar)',
        borderColor: 'var(--vsc-border)',
      }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 border-b shrink-0"
        style={{ borderColor: 'var(--vsc-border)' }}
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
        <div>
          <p className="text-xs font-semibold" style={{ color: 'var(--vsc-text)' }}>
            AI アナリスト
          </p>
          {company && (
            <p className="text-[10px]" style={{ color: 'var(--vsc-text-muted)' }}>
              {company.name}
            </p>
          )}
        </div>
      </div>

      <MessageList messages={messages} />

      {loading && (
        <div className="px-4 py-1">
          <span className="text-xs" style={{ color: 'var(--vsc-text-muted)' }}>
            分析中...
          </span>
        </div>
      )}

      <ChatInput onSend={handleSend} disabled={!company || loading} />
    </div>
  )
}
