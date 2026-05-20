'use client'

import Image from 'next/image'
import { TableCell } from '@/components/ui/table'
import { ImageIcon, ClockIcon, CheckIcon, RotateCcwIcon, XIcon, HelpCircleIcon } from '@/lib/constants/icons'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils/format.utils'
import { useTranslation } from '@/lib/context/translation.context'
import { BadgePill, type BadgeVariant } from '@/components/dashboard/bookings/status-badge'
import type { AdminBooking } from '@/lib/api/bookings'

const EM_DASH = '—'

const PAYMENT_STATUS_CONFIG: Record<string, { variant: BadgeVariant; icon: React.ElementType }> = {
  PENDING: { variant: 'amber', icon: ClockIcon },
  PAID: { variant: 'green', icon: CheckIcon },
  REFUNDED: { variant: 'blue', icon: RotateCcwIcon },
  FAILED: { variant: 'red', icon: XIcon },
}

export function BookingCoverCell({ booking }: { booking: AdminBooking }) {
  return (
    <TableCell>
      {booking.listing.cover ? (
        <Image
          src={booking.listing.cover}
          alt={booking.listing.name}
          width={40}
          height={40}
          className="size-10 rounded-lg object-cover"
          unoptimized
        />
      ) : (
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <ImageIcon className="size-4 text-muted-foreground" />
        </div>
      )}
    </TableCell>
  )
}

export function BookingNameCell({ booking }: { booking: AdminBooking }) {
  return <TableCell className="font-medium">{booking.listing.name}</TableCell>
}

export function BookingDateCell({ booking }: { booking: AdminBooking }) {
  return (
    <TableCell className="text-muted-foreground">
      <div className="flex flex-col">
        <span>
          {formatDate(booking.date)}
          {booking.dateTo && <> – {formatDate(booking.dateTo)}</>}
        </span>
        {booking.timeSlot && (
          <span className="text-xs">
            {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
          </span>
        )}
      </div>
    </TableCell>
  )
}

export function BookingParticipantsCell({ booking }: { booking: AdminBooking }) {
  return (
    <TableCell>
      <span className="text-sm">{booking.totalPax}</span>
    </TableCell>
  )
}

export function BookingTotalCell({ booking }: { booking: AdminBooking }) {
  return (
    <TableCell className="text-sm">
      {booking.priceSnapshot ? formatCurrency(booking.priceSnapshot.total) : EM_DASH}
    </TableCell>
  )
}

export function BookingDepositCell({ booking }: { booking: AdminBooking }) {
  return (
    <TableCell className="text-sm text-muted-foreground">
      {booking.depositAmount ? formatCurrency(booking.depositAmount) : EM_DASH}
    </TableCell>
  )
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const t = useTranslation() as Record<string, string>
  const config = PAYMENT_STATUS_CONFIG[status] ?? { variant: 'gray' as const, icon: HelpCircleIcon }
  return (
    <BadgePill variant={config.variant} icon={config.icon}>
      {t[`admin_payment_status_${status.toLowerCase()}`] || status}
    </BadgePill>
  )
}
