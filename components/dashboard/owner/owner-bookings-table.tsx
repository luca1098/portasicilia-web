'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { CalendarCheck2Icon, ChevronDownIcon, ImageIcon, LoaderIcon } from '@/lib/constants/icons'
import { getOwnerBookingsAction } from '@/lib/actions/owner-bookings.actions'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils/format.utils'
import { cn } from '@/lib/utils/shadcn.utils'
import type { AdminBooking, GetAdminBookingsParams, PaginatedAdminBookings } from '@/lib/api/bookings'

type OwnerBookingsTableProps = {
  initialBookings: AdminBooking[]
  initialNextCursor: string | null
  fetchParams: GetAdminBookingsParams
}

function BookingRow({ booking }: { booking: AdminBooking }) {
  const t = useTranslation() as Record<string, string>
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow className="cursor-pointer" onClick={() => setOpen(!open)}>
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
        <TableCell className="font-medium">{booking.listing.name}</TableCell>
        <TableCell className="text-muted-foreground">
          <div className="flex flex-col">
            <span>{formatDate(booking.date)}</span>
            {booking.timeSlot && (
              <span className="text-xs">
                {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
              </span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <span className="text-sm">{booking.totalPax}</span>
        </TableCell>
        <TableCell className="text-sm">
          {booking.priceSnapshot ? formatCurrency(booking.priceSnapshot.total) : '\u2014'}
        </TableCell>
        <TableCell>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={e => {
              e.stopPropagation()
              setOpen(!open)
            }}
          >
            <ChevronDownIcon
              className={cn('size-4 transition-transform duration-200', open && 'rotate-180')}
            />
          </Button>
        </TableCell>
      </TableRow>
      {open && (
        <tr>
          <td colSpan={6} className="border-b border-border bg-muted/30 px-6 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t.owner_detail_date}
                </p>
                <p className="mt-1 text-sm">
                  {formatDate(booking.date)}
                  {booking.timeSlot && (
                    <span className="text-muted-foreground">
                      {' '}
                      {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
                    </span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t.owner_detail_participants}
                </p>
                <div className="mt-1 space-y-0.5">
                  {booking.participants.map(p => (
                    <p key={p.type} className="text-sm">
                      {p.quantity}x {t[`owner_participant_${p.type.toLowerCase()}`] || p.type}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t.owner_detail_payment}
                </p>
                <div className="mt-1 space-y-0.5 text-sm">
                  <p>
                    {t.owner_detail_total}:{' '}
                    {booking.priceSnapshot ? formatCurrency(booking.priceSnapshot.total) : '\u2014'}
                  </p>
                  {booking.depositAmount && (
                    <p className="text-muted-foreground">
                      {t.owner_detail_deposit}: {formatCurrency(booking.depositAmount)}
                    </p>
                  )}
                </div>
              </div>

              {booking.priceSnapshot && booking.priceSnapshot.lineItems.length > 0 && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t.owner_detail_price_breakdown}
                  </p>
                  <div className="mt-1 space-y-0.5">
                    {booking.priceSnapshot.lineItems.map((item, i) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        {item.quantity}x {item.label} — {formatCurrency(item.subtotal)}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function OwnerBookingsTable({
  initialBookings,
  initialNextCursor,
  fetchParams,
}: OwnerBookingsTableProps) {
  const t = useTranslation() as Record<string, string>
  const [bookings, setBookings] = useState(initialBookings)
  const [nextCursor, setNextCursor] = useState(initialNextCursor)

  const { loading, execute: loadMore } = useAction<PaginatedAdminBookings>({
    onSuccess: data => {
      if (data) {
        setBookings(prev => [...prev, ...data.data])
        setNextCursor(data.nextCursor)
      }
    },
  })

  function handleLoadMore() {
    if (!nextCursor) return
    loadMore(() => getOwnerBookingsAction({ ...fetchParams, cursor: nextCursor }))
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
          <CalendarCheck2Icon className="size-6 text-muted-foreground/50" />
        </div>
        <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/70">
          {t.owner_bookings_no_results}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16" />
              <TableHead>{t.owner_col_experience}</TableHead>
              <TableHead>{t.owner_col_date}</TableHead>
              <TableHead>{t.owner_col_participants}</TableHead>
              <TableHead>{t.owner_col_total}</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map(booking => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </TableBody>
        </Table>
      </div>
      {nextCursor && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {t.admin_load_more}
          </Button>
        </div>
      )}
    </div>
  )
}
