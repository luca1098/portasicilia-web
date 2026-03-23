'use client'

import { createContext, use, useState } from 'react'

type TranslationToggleContextValue = {
  isTranslated: boolean
  showingOriginal: boolean
  toggle: () => void
}

const TranslationToggleContext = createContext<TranslationToggleContextValue | null>(null)

type TranslationToggleProviderProps = {
  translated?: boolean
  children: React.ReactNode
}

export function TranslationToggleProvider({ translated, children }: TranslationToggleProviderProps) {
  const [showingOriginal, setShowingOriginal] = useState(false)
  const isTranslated = translated === true

  const toggle = () => setShowingOriginal(prev => !prev)

  return (
    <TranslationToggleContext value={{ isTranslated, showingOriginal, toggle }}>
      {children}
    </TranslationToggleContext>
  )
}

export function useTranslationToggle() {
  const ctx = use(TranslationToggleContext)
  if (!ctx) {
    return { isTranslated: false, showingOriginal: false, toggle: () => {} }
  }
  return ctx
}
