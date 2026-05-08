import { it, enUS, es, fr, de, type Locale } from 'date-fns/locale'
import { it as rdpIt, enUS as rdpEnUS, es as rdpEs, fr as rdpFr, de as rdpDe } from 'react-day-picker/locale'
import type { SupportedLocale } from '@/lib/configs/locales'

const dateFnsLocales: Record<SupportedLocale, Locale> = {
  it,
  en: enUS,
  es,
  fr,
  de,
}

const reactDayPickerLocales = {
  it: rdpIt,
  en: rdpEnUS,
  es: rdpEs,
  fr: rdpFr,
  de: rdpDe,
} as const

export const getDateFnsLocale = (lang: string): Locale => dateFnsLocales[lang as SupportedLocale] ?? it

export const getDayPickerLocale = (lang: string) => reactDayPickerLocales[lang as SupportedLocale] ?? rdpIt
