'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { CalendarCheck2Icon, EyeIcon, MoreHorizontalIcon, XIcon } from '@/lib/constants/icons'
import { getOwnerBookingsAction } from '@/lib/actions/owner-bookings.actions'
import { OwnerBookingDetailDialog } from '@/components/dashboard/bookings/booking-detail-dialog'
import CancelBookingDialog from '@/components/dashboard/user/cancel-booking-dialog'
import { StatusBadge } from '@/components/dashboard/bookings/status-badge'
import {
  BookingCoverCell,
  BookingNameCell,
  BookingDateCell,
  BookingParticipantsCell,
  BookingTotalCell,
} from '@/components/dashboard/bookings/booking-cells'
import { BookingsEmpty, BookingsLoadMore } from '@/components/dashboard/bookings/bookings-table-shell'
import { isBookingCancellable } from '@/lib/utils/booking.utils'
import type { AdminBooking, GetAdminBookingsParams, PaginatedAdminBookings } from '@/lib/api/bookings'

type OwnerBookingsTableProps = {
  initialBookings: AdminBooking[]
  initialNextCursor: string | null
  fetchParams: GetAdminBookingsParams
}

export default function OwnerBookingsTable({
  initialBookings,
  initialNextCursor,
  fetchParams,
}: OwnerBookingsTableProps) {
  const t = useTranslation() as Record<string, string>
  const [bookings, setBookings] = useState(initialBookings)
  const [nextCursor, setNextCursor] = useState(initialNextCursor)
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null)
  const [cancelTarget, setCancelTarget] = useState<AdminBooking | null>(null)

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

  function handleBookingCancelled(cancelledId: string) {
    setBookings(prev => prev.map(b => (b.id === cancelledId ? { ...b, status: 'CANCELLED' } : b)))
  }

  if (bookings.length === 0) {
    return <BookingsEmpty icon={CalendarCheck2Icon}>{t.owner_bookings_no_results}</BookingsEmpty>
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
              <TableHead>{t.owner_col_status}</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map(booking => {
              const canCancel = isBookingCancellable(booking)
              return (
                <TableRow
                  key={booking.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <BookingCoverCell booking={booking} />
                  <BookingNameCell booking={booking} />
                  <BookingDateCell booking={booking} />
                  <BookingParticipantsCell booking={booking} />
                  <BookingTotalCell booking={booking} />
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canCancel ? (
                          <DropdownMenuItem
                            onSelect={() => setCancelTarget(booking)}
                            className="text-destructive focus:text-destructive"
                          >
                            <XIcon className="size-4" />
                            {t.user_cancel_action}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onSelect={() => setSelectedBooking(booking)}>
                            <EyeIcon className="size-4" />
                            {t.admin_booking_action_view}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      {nextCursor && <BookingsLoadMore onClick={handleLoadMore} loading={loading} />}

      <OwnerBookingDetailDialog
        booking={selectedBooking}
        open={!!selectedBooking}
        onOpenChange={open => !open && setSelectedBooking(null)}
        onCancelled={handleBookingCancelled}
      />

      <CancelBookingDialog
        open={!!cancelTarget}
        onOpenChange={open => !open && setCancelTarget(null)}
        bookingId={cancelTarget?.id ?? ''}
        onSuccess={() => {
          if (cancelTarget) handleBookingCancelled(cancelTarget.id)
          setCancelTarget(null)
        }}
      />
    </div>
  )
}
