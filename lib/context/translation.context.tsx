'use client'

import { getTranslations } from '@/lib/configs/locales/i18n'
import React from 'react'

type Translation = Awaited<ReturnType<typeof getTranslations>>

const TContext = React.createContext<Translation | null>(null)

export default function TranslationContext({ t, children }: { t: Translation; children: React.ReactNode }) {
  return <TContext.Provider value={t}>{children}</TContext.Provider>
}

export function useDictionary() {
  const dictionary = React.useContext(TContext)
  if (dictionary === null) {
    throw new Error('useDictionary hook must be used within DictionaryProvider')
  }

  return dictionary
}

export function useTranslation() {
  const t = React.useContext(TContext)
  if (t === null) {
    throw new Error('useTranslation hook must be used within TranslationContext')
  }

  return t
}
