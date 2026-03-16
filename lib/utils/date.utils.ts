const ROME_TZ = 'Europe/Rome'

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
