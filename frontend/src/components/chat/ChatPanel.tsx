'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
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
  isMobile?: boolean
  onToggle: () => void
  onWidthChange: (w: number) => void
}

export function ChatPanel({ company, width, isOpen, isMobile = false, onToggle, onWidthChange }: ChatPanelProps) {
  const { chatHistories, addMessage, pendingQuestion, setPendingQuestion } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [drawerHeight, setDrawerHeight] = useState(70) // vh
  const [selectedModel, setSelectedModel] = useState<'claude' | 'deepseek'>('deepseek')

  const handleDrawerDrag = (e: React.TouchEvent | React.MouseEvent) => {
    const startY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const startHeight = drawerHeight

    const onMove = (ev: TouchEvent | MouseEvent) => {
      const currentY = 'touches' in ev ? (ev as TouchEvent).touches[0].clientY : (ev as MouseEvent).clientY
      const deltaVh = ((startY - currentY) / window.innerHeight) * 100
      const newHeight = Math.max(20, Math.min(90, startHeight + deltaVh))
      setDrawerHeight(newHeight)
    }

    const onEnd = (ev: TouchEvent | MouseEvent) => {
      const currentY = 'touches' in ev ? (ev as TouchEvent).changedTouches[0].clientY : (ev as MouseEvent).clientY
      const deltaVh = ((startY - currentY) / window.innerHeight) * 100
      if (startHeight + deltaVh < 15) onToggle()
      document.removeEventListener('touchmove', onMove as EventListener)
      document.removeEventListener('mousemove', onMove as EventListener)
      document.removeEventListener('touchend', onEnd as EventListener)
      document.removeEventListener('mouseup', onEnd as EventListener)
    }

    document.addEventListener('touchmove', onMove as EventListener, { passive: true })
    document.addEventListener('mousemove', onMove as EventListener)
    document.addEventListener('touchend', onEnd as EventListener)
    document.addEventListener('mouseup', onEnd as EventListener)
  }

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
        body: JSON.stringify({ query: text, ticker: company.ticker, model: selectedModel }),
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

  // モバイル: ボトムドロワー
  if (isMobile) {
    if (!isOpen) return null
    return (
      <div
        className="fixed inset-x-0 bottom-0 z-50 flex flex-col border-t rounded-t-xl"
        style={{
          height: `${drawerHeight}vh`,
          backgroundColor: 'var(--vsc-sidebar)',
          borderColor: 'var(--vsc-border)',
        }}
      >
        {/* ドラッグハンドル */}
        <div
          className="flex justify-center py-3 shrink-0 cursor-row-resize touch-none"
          onMouseDown={handleDrawerDrag}
          onTouchStart={handleDrawerDrag}
        >
          <div className="w-8 h-1 rounded-full" style={{ backgroundColor: 'var(--vsc-border)' }} />
        </div>

        <div
          className="flex items-center gap-2 px-4 py-2 border-b shrink-0"
          style={{ borderColor: 'var(--vsc-border)' }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--vsc-text)' }}>
              AI アナリスト
            </p>
            {company && (
              <p className="text-xs" style={{ color: 'var(--vsc-text-muted)' }}>
                {company.name}
              </p>
            )}
          </div>
          <select
              value={selectedModel}
              onChange={(e) => { if (e.target.value !== 'claude') setSelectedModel(e.target.value as 'claude' | 'deepseek') }}
              className="text-xs rounded px-1 py-0.5 border-0 cursor-pointer"
              style={{ backgroundColor: 'var(--vsc-editor)', color: 'var(--vsc-text)' }}
            >
              <option value="claude" disabled>Claude Haiku（使用制限中）</option>
              <option value="deepseek">DeepSeek V4 Flash</option>
            </select>
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-10 h-10 rounded bg-transparent border-0 cursor-pointer"
            style={{ color: 'var(--vsc-text-muted)' }}
          >
            <ChevronDown size={20} />
          </button>
        </div>

        <MessageList messages={messages} loading={loading} />
        <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSend} disabled={!company || loading} />
        </div>
      </div>
    )
  }

  // デスクトップ: サイドパネル
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
        <div className="flex-1">
          <p className="text-xs font-semibold" style={{ color: 'var(--vsc-text)' }}>
            AI アナリスト
          </p>
          {company && (
            <p className="text-[10px]" style={{ color: 'var(--vsc-text-muted)' }}>
              {company.name}
            </p>
          )}
        </div>
        <select
          value={selectedModel}
          onChange={(e) => { if (e.target.value !== 'claude') setSelectedModel(e.target.value as 'claude' | 'deepseek') }}
          className="text-[10px] rounded px-1 py-0.5 border-0 cursor-pointer"
          style={{ backgroundColor: 'var(--vsc-editor)', color: 'var(--vsc-text)' }}
        >
          <option value="claude" disabled>Claude Haiku（使用制限中）</option>
          <option value="deepseek">DeepSeek V4 Flash</option>
        </select>
      </div>

      <MessageList messages={messages} loading={loading} />
      <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSend} disabled={!company || loading} />
    </div>
  )
}
