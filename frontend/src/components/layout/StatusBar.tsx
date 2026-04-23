'use client'

import { useEffect, useState } from 'react'
import { mockCompanies } from '@/data/mockCompanies'

export function StatusBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="flex items-center justify-between h-6 px-3 text-xs shrink-0 select-none"
      style={{ backgroundColor: 'var(--vsc-status-bar)', color: '#ffffff' }}
    >
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          接続済み
        </span>
        <span>{mockCompanies.length} 社ロード済み</span>
        {time && <span>最終更新: {time}</span>}
      </div>
      <div className="flex items-center gap-4">
        <span>東証プライム</span>
        <span>UTF-8</span>
      </div>
    </div>
  )
}
