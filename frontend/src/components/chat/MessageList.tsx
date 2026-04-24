'use client'

import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Message } from '@/types'
import { MessageBubble } from './MessageBubble'
import { Bot } from 'lucide-react'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

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
          <div ref={bottomRef} />
        </div>
      )}
    </ScrollArea>
  )
}
