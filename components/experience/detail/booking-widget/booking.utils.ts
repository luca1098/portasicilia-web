import type { AvailableDateSlots } from '@/lib/api/experiences'

export const DAY_MAP: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatDayHeader(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return capitalizeFirst(date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }))
}

export function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return capitalizeFirst(date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' }))
}

export function groupByMonth(entries: AvailableDateSlots[]): Map<string, AvailableDateSlots[]> {
  const grouped = new Map<string, AvailableDateSlots[]>()
  for (const entry of entries) {
    const date = new Date(entry.date + 'T00:00:00')
    const key = `${date.getFullYear()}-${date.getMonth()}`
    const existing = grouped.get(key) ?? []
    existing.push(entry)
    grouped.set(key, existing)
  }
  return grouped
}
