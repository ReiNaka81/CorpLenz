'use client'

import { useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface ChatInputProps {
  onSend: (text: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    textareaRef.current?.style && (textareaRef.current.style.height = 'auto')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 80)}px`
  }

  return (
    <div
      className="flex items-end gap-2 p-3 border-t"
      style={{ borderColor: 'var(--vsc-border)' }}
    >
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="質問を入力... (Enter で送信)"
        disabled={disabled}
        rows={1}
        className="resize-none text-xs min-h-[32px] max-h-[80px] border-0 focus-visible:ring-1 py-2"
        style={{
          backgroundColor: 'var(--vsc-editor)',
          color: 'var(--vsc-text)',
        }}
      />
      <Button
        size="icon"
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className="h-8 w-8 shrink-0"
        style={{ backgroundColor: 'var(--vsc-accent)' }}
      >
        <ArrowUp size={14} />
      </Button>
    </div>
  )
}
