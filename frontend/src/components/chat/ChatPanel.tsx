'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Company, Message } from '@/types'
import { useAppStore } from '@/store/appStore'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'

const MIN_WIDTH = 200
const MAX_WIDTH = 600

interface ChatPanelProps {
  company: Company | null
  width: number
  isOpen: boolean
  onToggle: () => void
  onWidthChange: (w: number) => void
}

export function ChatPanel({ company, width, isOpen, onToggle, onWidthChange }: ChatPanelProps) {
  const { chatHistories, addMessage, pendingQuestion, setPendingQuestion } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const messages: Message[] = company ? (chatHistories[company.id] ?? []) : []

  useEffect(() => {
    if (pendingQuestion) {
      setInputValue(pendingQuestion)
      setPendingQuestion(null)
    }
  }, [pendingQuestion, setPendingQuestion])

  const handleSend = async (text: string) => {
    if (!company) return

    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() }
    addMessage(company.id, userMsg)
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
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

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = width
    const onMouseMove = (ev: MouseEvent) => {
      onWidthChange(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth + startX - ev.clientX)))
    }
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  if (!isOpen) {
    return (
      <div
        className="flex flex-col items-center w-6 shrink-0 border-l cursor-pointer"
        style={{ backgroundColor: 'var(--vsc-sidebar)', borderColor: 'var(--vsc-border)' }}
        onClick={onToggle}
        title="AIアナリストを開く"
      >
        <div className="flex items-center justify-center h-8 mt-1" style={{ color: 'var(--vsc-text-muted)' }}>
          <ChevronLeft size={14} />
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative flex flex-col shrink-0 border-l"
      style={{
        width,
        backgroundColor: 'var(--vsc-sidebar)',
        borderColor: 'var(--vsc-border)',
      }}
    >
      {/* Drag handle (left edge) */}
      <div
        className="absolute left-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400/50 transition-colors z-10"
        onMouseDown={handleDragStart}
      />

      <div
        className="flex items-center gap-2 px-3 py-2 border-b shrink-0"
        style={{ borderColor: 'var(--vsc-border)' }}
      >
        <button
          onClick={onToggle}
          className="p-0.5 rounded hover:text-white transition-colors bg-transparent border-0 cursor-pointer shrink-0"
          style={{ color: 'var(--vsc-text-muted)' }}
        >
          <ChevronRight size={14} />
        </button>
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

      <MessageList messages={messages} loading={loading} />

      <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSend} disabled={!company || loading} />
    </div>
  )
}
