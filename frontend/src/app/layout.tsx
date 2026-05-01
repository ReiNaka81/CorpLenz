import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ClerkProvider } from '@clerk/nextjs'
import { jaJP } from '@clerk/localizations'

const customJa = {
  ...jaJP,
  signIn: {
    ...jaJP.signIn,
    start: {
      ...jaJP.signIn?.start,
      subtitle: '',
      subtitleCombined: '',
    },
  },
  signUp: {
    ...jaJP.signUp,
    start: {
      ...jaJP.signUp?.start,
      subtitle: '',
      subtitleCombined: '',
    },
  },
}
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'


export const metadata: Metadata = {
  title: 'CorpLens — 企業財務分析',
  description: '有価証券報告書RAGによる企業財務分析ツール',
}

export const viewport: Viewport = {
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body>
        <ClerkProvider localization={customJa}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
