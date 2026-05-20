'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import {
  CalendarCheck2Icon,
  MoreHorizontalIcon,
  EyeIcon,
  ExternalLinkIcon,
  XIcon,
  RotateCcwIcon,
} from '@/lib/constants/icons'
import { getAdminBookingsAction } from '@/lib/actions/bookings.actions'
import { refundBooking } from '@/lib/api/bookings'
import { AdminBookingDetailDialog } from '@/components/dashboard/bookings/booking-detail-dialog'
import CancelBookingDialog from '@/components/dashboard/user/cancel-booking-dialog'
import { StatusBadge } from '@/components/dashboard/bookings/status-badge'
import {
  BookingCoverCell,
  BookingNameCell,
  BookingDateCell,
  BookingParticipantsCell,
  BookingTotalCell,
  BookingDepositCell,
  PaymentStatusBadge,
} from '@/components/dashboard/bookings/booking-cells'
import { BookingsEmpty, BookingsLoadMore } from '@/components/dashboard/bookings/bookings-table-shell'
import { isBookingCancellable } from '@/lib/utils/booking.utils'
import type { AdminBooking, GetAdminBookingsParams, PaginatedAdminBookings } from '@/lib/api/bookings'

type BookingsTableProps = {
  initialBookings: AdminBooking[]
  initialNextCursor: string | null
  fetchParams: GetAdminBookingsParams
}

function BookingRowActions({
  booking,
  onView,
  onCancel,
  onRefundSuccess,
}: {
  booking: AdminBooking
  onView: () => void
  onCancel: () => void
  onRefundSuccess: (bookingId: string) => void
}) {
  const t = useTranslation() as Record<string, string>
  const { data: session } = useSession()
  const accessToken = session?.accessToken
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)

  const { loading: refundLoading, execute: executeRefund } = useAction<AdminBooking>({
    successMessage: t.admin_booking_refund_success,
    onSuccess: () => {
      onRefundSuccess(booking.id)
      setRefundDialogOpen(false)
    },
  })

  const canCancel = isBookingCancellable(booking)
  const isRefundable = booking.status === 'CANCELLED' && booking.paymentStatus !== 'REFUNDED'
  const isRefunded = booking.status === 'CANCELLED' && booking.paymentStatus === 'REFUNDED'

  function handleRefund() {
    if (!accessToken) return
    executeRefund(async () => {
      const data = await refundBooking(booking.id, accessToken)
      return { success: true, data }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canCancel ? (
            <DropdownMenuItem onSelect={onCancel} className="text-destructive focus:text-destructive">
              <XIcon className="size-4" />
              {t.user_cancel_action}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={onView}>
              <EyeIcon className="size-4" />
              {t.admin_booking_action_view}
            </DropdownMenuItem>
          )}
          {isRefundable && (
            <DropdownMenuItem onSelect={() => setRefundDialogOpen(true)}>
              <RotateCcwIcon className="size-4" />
              {t.admin_booking_action_refund}
            </DropdownMenuItem>
          )}
          {isRefunded && (
            <DropdownMenuItem disabled>
              <RotateCcwIcon className="size-4" />
              {t.admin_booking_payment_refunded}
            </DropdownMenuItem>
          )}
          {booking.stripePaymentIntentId && (
            <DropdownMenuItem asChild>
              <a
                href={`https://dashboard.stripe.com/payments/${booking.stripePaymentIntentId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon className="size-4" />
                {t.admin_booking_action_view_on_stripe}
              </a>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.admin_booking_refund_confirm_title}</AlertDialogTitle>
            <AlertDialogDescription>{t.admin_booking_refund_confirm_desc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={refundLoading}>
              {t.admin_booking_refund_confirm_cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={e => {
                e.preventDefault()
                handleRefund()
              }}
              disabled={refundLoading}
            >
              {t.admin_booking_refund_confirm_action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default function BookingsTable({
  initialBookings,
  initialNextCursor,
  fetchParams,
}: BookingsTableProps) {
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

  function handleBookingCancelled(cancelledId: string) {
    setBookings(prev => prev.map(b => (b.id === cancelledId ? { ...b, status: 'CANCELLED' } : b)))
  }

  function handleRefundSuccess(bookingId: string) {
    setBookings(prev => prev.map(b => (b.id === bookingId ? { ...b, paymentStatus: 'REFUNDED' } : b)))
  }

  function handleLoadMore() {
    if (!nextCursor) return
    loadMore(() => getAdminBookingsAction({ ...fetchParams, cursor: nextCursor }))
  }

  if (bookings.length === 0) {
    return <BookingsEmpty icon={CalendarCheck2Icon}>{t.admin_bookings_no_results}</BookingsEmpty>
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16" />
              <TableHead>{t.admin_booking_col_experience}</TableHead>
              <TableHead>{t.admin_booking_col_date}</TableHead>
              <TableHead>{t.admin_booking_col_participants}</TableHead>
              <TableHead>{t.admin_booking_col_total}</TableHead>
              <TableHead>{t.admin_booking_col_deposit}</TableHead>
              <TableHead>{t.admin_booking_col_status}</TableHead>
              <TableHead>{t.admin_booking_col_payment}</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map(booking => (
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
                <BookingDepositCell booking={booking} />
                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={booking.paymentStatus} />
                </TableCell>
                <TableCell onClick={e => e.stopPropagation()}>
                  <BookingRowActions
                    booking={booking}
                    onView={() => setSelectedBooking(booking)}
                    onCancel={() => setCancelTarget(booking)}
                    onRefundSuccess={handleRefundSuccess}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {nextCursor && <BookingsLoadMore onClick={handleLoadMore} loading={loading} />}

      <AdminBookingDetailDialog
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
