import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const COMPANY_COLORS = [
  '#e50012', '#003087', '#cf0a2c', '#e60012', '#0060a9',
  '#cc0000', '#1a237e', '#ffca28', '#d32f2f', '#1565c0',
  '#2e7d32', '#6a1b9a', '#0277bd', '#ef6c00', '#37474f',
]

export function tickerToColor(ticker: string): string {
  let hash = 0
  for (let i = 0; i < ticker.length; i++) {
    hash = ticker.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COMPANY_COLORS[Math.abs(hash) % COMPANY_COLORS.length]
}
