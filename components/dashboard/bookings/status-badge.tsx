'use client'

import { useTranslation } from '@/lib/context/translation.context'

const STATUS_COLORS: Record<string, string> = {
  PENDING_APPROVAL: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  COUNTER_PROPOSED: 'bg-orange-100 text-orange-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  NO_SHOW: 'bg-gray-100 text-gray-500',
}

export function StatusBadge({ status }: { status: string }) {
  const t = useTranslation() as Record<string, string>

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status] || 'bg-muted text-muted-foreground'}`}
    >
      {t[`admin_booking_status_${status.toLowerCase()}`] || status}
    </span>
  )
}

export function PaymentBadge({ status }: { status: string }) {
  const t = useTranslation()

  if (status !== 'REFUNDED') return null
  return (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
      {t.admin_booking_payment_refunded}
    </span>
  )
}
