'use client'

import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Message } from '@/types'
import { MessageBubble } from './MessageBubble'
import { Bot } from 'lucide-react'

interface MessageListProps {
  messages: Message[]
  loading?: boolean
}

export function MessageList({ messages, loading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, loading])

  return (
    <ScrollArea className="flex-1 min-h-0 px-3 py-2">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-2 py-8">
          <Bot size={28} style={{ color: 'var(--vsc-text-muted)' }} />
          <p className="text-xs text-center px-4" style={{ color: 'var(--vsc-text-muted)' }}>
            企業の財務データについて何でも聞いてください
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {loading && (
            <div className="flex items-end gap-2">
              <div
                className="flex items-center justify-center w-6 h-6 rounded-full shrink-0"
                style={{ backgroundColor: 'var(--vsc-activity-bar)' }}
              >
                <Bot size={12} style={{ color: 'var(--vsc-text-muted)' }} />
              </div>
              <div
                className="flex items-center gap-1 px-3 py-2 rounded-lg rounded-bl-none"
                style={{ backgroundColor: 'var(--vsc-activity-bar)', border: '1px solid var(--vsc-border)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" style={{ color: 'var(--vsc-text-muted)' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]" style={{ color: 'var(--vsc-text-muted)' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]" style={{ color: 'var(--vsc-text-muted)' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </ScrollArea>
  )
}
