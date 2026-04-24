'use client'

import ReactMarkdown from 'react-markdown'
import { Message } from '@/types'
import { Bot, User } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAI = message.role === 'ai'

  return (
    <div className={`flex gap-2 ${isAI ? '' : 'flex-row-reverse'}`}>
      <div
        className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 mt-0.5"
        style={{
          backgroundColor: isAI ? 'var(--vsc-accent)' : '#4a4a4a',
          color: '#ffffff',
        }}
      >
        {isAI ? <Bot size={12} /> : <User size={12} />}
      </div>
      <div
        className="max-w-[80%] rounded px-3 py-2 text-xs leading-relaxed border"
        style={{
          backgroundColor: isAI ? 'var(--vsc-sidebar)' : 'var(--vsc-selection)',
          borderColor: 'var(--vsc-border)',
          color: 'var(--vsc-text)',
        }}
      >
        {isAI ? (
          <div className="prose prose-invert prose-xs max-w-none
            [&_p]:mb-1 [&_p]:leading-relaxed
            [&_ul]:mt-1 [&_ul]:mb-1 [&_ul]:pl-4 [&_li]:mb-0.5
            [&_ol]:mt-1 [&_ol]:mb-1 [&_ol]:pl-4
            [&_strong]:font-semibold
            [&_h1]:text-xs [&_h2]:text-xs [&_h3]:text-xs [&_h4]:text-xs"
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
        <p
          className="text-[10px] mt-1"
          style={{ color: 'var(--vsc-text-muted)' }}
        >
          {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}
