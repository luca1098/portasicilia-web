import { parseDate } from './date.utils'

export function formatDate(dateString: string) {
  return parseDate(dateString).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatTime(time: string) {
  return time.slice(0, 5)
}

export function formatCurrency(value: string) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(Number(value))
}
