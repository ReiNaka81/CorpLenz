'use client'

import { SignInButton, Show, UserButton } from '@clerk/nextjs'

export function TitleBar() {
  return (
    <div
      className="flex items-center h-8 text-xs select-none shrink-0 px-3"
      style={{ backgroundColor: 'var(--vsc-title-bar)', color: 'var(--vsc-text)' }}
    >
      <span className="flex-1 text-center">CorpLens — 企業財務分析</span>
      <div className="flex items-center">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="text-xs px-2 py-0.5 rounded transition-colors hover:opacity-80" style={{ backgroundColor: 'var(--vsc-accent)', color: '#ffffff' }}>
              サインイン
            </button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <UserButton appearance={{ elements: { avatarBox: 'w-5 h-5' } }} />
        </Show>
      </div>
    </div>
  )
}
