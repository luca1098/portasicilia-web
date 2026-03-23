'use client'

import { LanguagesIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { useTranslationToggle } from '@/lib/context/translation-toggle.context'

export default function TranslationBadge() {
  const t = useTranslation()
  const { isTranslated, showingOriginal, toggle } = useTranslationToggle()

  if (!isTranslated) return null

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <LanguagesIcon className="size-3.5 shrink-0" />
      <span>{t.auto_translated_notice}</span>
      <span aria-hidden>·</span>
      <button type="button" className="underline underline-offset-2 hover:text-foreground" onClick={toggle}>
        {showingOriginal ? t.show_translation : t.show_original}
      </button>
    </span>
  )
}
