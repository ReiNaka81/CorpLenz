'use client'

export function TitleBar() {
  return (
    <div
      className="flex items-center justify-center h-8 text-xs select-none shrink-0"
      style={{ backgroundColor: 'var(--vsc-title-bar)', color: '#cccccc' }}
    >
      CorpLens — 企業財務分析
    </div>
  )
}
