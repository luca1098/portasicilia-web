'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supportedLocales, type SupportedLocale } from '@/lib/configs/locales'
import { useLocaleActions } from './locale.store'

const LOCALE_COOKIE = 'ps-lang'
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

export default function LocaleSync() {
  const { lang } = useParams<{ lang: string }>()
  const { setLocale } = useLocaleActions()

  useEffect(() => {
    if (!lang) return
    if ((supportedLocales as readonly string[]).includes(lang)) {
      setLocale(lang as SupportedLocale)
      // Mirror the locale into a real cookie so server-side code
      // (e.g. NextAuth callbacks) can read it.
      document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`
    }
  }, [lang, setLocale])

  return null
}
