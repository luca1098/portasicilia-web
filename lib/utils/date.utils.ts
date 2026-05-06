import { interpolate } from '@/lib/utils/i18n.utils'

const ROME_TZ = 'Europe/Rome'

type RelativeTimeTranslations = {
  justNow: string
  daysAgo: string
  weeksAgo: string
  monthsAgo: string
}

export function getRelativeTime(dateStr: string, translations: RelativeTimeTranslations): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 1) return translations.justNow
  if (diffDays < 7) return interpolate(translations.daysAgo, { count: String(diffDays) })
  if (diffDays < 30) return interpolate(translations.weeksAgo, { count: String(Math.floor(diffDays / 7)) })
  return interpolate(translations.monthsAgo, { count: String(Math.floor(diffDays / 30)) })
}

/** Parse a date-only API string (YYYY-MM-DD or ISO with Z) as local midnight, preserving the calendar date. */
export function parseDate(dateString: string): Date {
  return new Date(dateString.substring(0, 10) + 'T00:00:00')
}

/** Today's date in Europe/Rome timezone as local midnight Date. */
export function today(): Date {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: ROME_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  // en-CA formats as YYYY-MM-DD
  return new Date(formatter.format(new Date()) + 'T00:00:00')
}
