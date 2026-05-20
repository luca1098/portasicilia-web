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
  ClipboardListIcon,
  MoreHorizontalIcon,
  EyeIcon,
  CheckIcon,
  XIcon,
  RotateCcwIcon,
} from '@/lib/constants/icons'
import { refundBooking, respondBooking } from '@/lib/api/bookings'
import { getAdminBookingsAction } from '@/lib/actions/bookings.actions'
import { StatusBadge, PaymentBadge } from '@/components/dashboard/bookings/status-badge'
import { AdminBookingDetailDialog } from '@/components/dashboard/bookings/booking-detail-dialog'
import {
  BookingCoverCell,
  BookingNameCell,
  BookingDateCell,
  BookingParticipantsCell,
  BookingTotalCell,
  BookingDepositCell,
} from '@/components/dashboard/bookings/booking-cells'
import {
  BookingsEmpty,
  BookingsLoadMore,
  StatusFilterPills,
  type StatusFilter,
} from '@/components/dashboard/bookings/bookings-table-shell'
import type { AdminBooking, GetAdminBookingsParams, PaginatedAdminBookings } from '@/lib/api/bookings'

type RequestsTableProps = {
  bookings: AdminBooking[]
  initialNextCursor: string | null
  fetchParams: GetAdminBookingsParams
  activeStatus?: string
}

const STATUS_FILTERS: StatusFilter[] = [
  { key: 'ALL', labelKey: 'admin_requests_filter_all' },
  { key: 'PENDING_APPROVAL', labelKey: 'admin_booking_status_pending_approval' },
  { key: 'REJECTED', labelKey: 'admin_booking_status_rejected' },
  { key: 'COUNTER_PROPOSED', labelKey: 'admin_booking_status_counter_proposed' },
  { key: 'NO_SHOW', labelKey: 'admin_booking_status_no_show' },
]

function BookingActions({
  booking,
  onRefundSuccess,
  onRespondSuccess,
  onView,
}: {
  booking: AdminBooking
  onRefundSuccess: (bookingId: string) => void
  onRespondSuccess: (updated: AdminBooking) => void
  onView: () => void
}) {
  const t = useTranslation() as Record<string, string>
  const { data: session } = useSession()
  const accessToken = session?.accessToken
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)

  const { loading: refundLoading, execute: executeRefund } = useAction<AdminBooking>({
    successMessage: t.admin_booking_refund_success,
    onSuccess: () => onRefundSuccess(booking.id),
  })

  const { loading: confirmLoading, execute: executeConfirm } = useAction<AdminBooking>({
    successMessage: t.admin_booking_confirm_success,
    onSuccess: data => {
      if (data) onRespondSuccess(data)
      setConfirmDialogOpen(false)
    },
  })

  const { loading: rejectLoading, execute: executeReject } = useAction<AdminBooking>({
    successMessage: t.admin_booking_reject_success,
    onSuccess: data => {
      if (data) onRespondSuccess(data)
      setRejectDialogOpen(false)
    },
  })

  const isPending = booking.status === 'PENDING_APPROVAL'
  const isRefundable =
    (booking.status === 'REJECTED' ||
      booking.status === 'COUNTER_PROPOSED' ||
      booking.status === 'CANCELLED') &&
    booking.paymentStatus !== 'REFUNDED'
  const isRefunded =
    (booking.status === 'REJECTED' ||
      booking.status === 'COUNTER_PROPOSED' ||
      booking.status === 'CANCELLED') &&
    booking.paymentStatus === 'REFUNDED'

  function handleRefund() {
    if (!accessToken) return
    executeRefund(async () => {
      const data = await refundBooking(booking.id, accessToken)
      return { success: true, data }
    })
  }

  function handleConfirm() {
    if (!accessToken) return
    executeConfirm(async () => {
      const data = await respondBooking(booking.id, { action: 'CONFIRM' }, accessToken)
      return { success: true, data }
    })
  }

  function handleReject() {
    if (!accessToken) return
    executeReject(async () => {
      const data = await respondBooking(booking.id, { action: 'REJECT' }, accessToken)
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
          <DropdownMenuItem onSelect={onView}>
            <EyeIcon className="size-4" />
            {t.admin_booking_action_view}
          </DropdownMenuItem>
          {isPending && (
            <>
              <DropdownMenuItem onSelect={() => setConfirmDialogOpen(true)}>
                <CheckIcon className="size-4" />
                {t.admin_booking_action_confirm}
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={() => setRejectDialogOpen(true)}>
                <XIcon className="size-4" />
                {t.admin_booking_action_reject}
              </DropdownMenuItem>
            </>
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
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.admin_booking_refund_confirm_title}</AlertDialogTitle>
            <AlertDialogDescription>{t.admin_booking_refund_confirm_desc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.admin_booking_refund_confirm_cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRefund} disabled={refundLoading}>
              {t.admin_booking_refund_confirm_action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.admin_booking_confirm_dialog_title}</AlertDialogTitle>
            <AlertDialogDescription>{t.admin_booking_confirm_dialog_desc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={confirmLoading}>
              {t.admin_booking_confirm_dialog_cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={e => {
                e.preventDefault()
                handleConfirm()
              }}
              disabled={confirmLoading}
            >
              {t.admin_booking_confirm_dialog_action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.admin_booking_reject_dialog_title}</AlertDialogTitle>
            <AlertDialogDescription>{t.admin_booking_reject_dialog_desc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={rejectLoading}>
              {t.admin_booking_reject_dialog_cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={e => {
                e.preventDefault()
                handleReject()
              }}
              disabled={rejectLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t.admin_booking_reject_dialog_action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function InnerBookingsTable({
  bookings: initialBookings,
  initialNextCursor,
  fetchParams,
  activeStatus,
}: {
  bookings: AdminBooking[]
  initialNextCursor: string | null
  fetchParams: GetAdminBookingsParams
  activeStatus: string
}) {
  const t = useTranslation() as Record<string, string>
  const [bookings, setBookings] = useState(initialBookings)
  const [nextCursor, setNextCursor] = useState(initialNextCursor)
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null)

  const { loading, execute: loadMore } = useAction<PaginatedAdminBookings>({
    onSuccess: data => {
      if (data) {
        setBookings(prev => [...prev, ...data.data])
        setNextCursor(data.nextCursor)
      }
    },
  })

  function handleRefundSuccess(bookingId: string) {
    setBookings(prev => prev.map(b => (b.id === bookingId ? { ...b, paymentStatus: 'REFUNDED' } : b)))
  }

  function handleRespondSuccess(updated: AdminBooking) {
    if (activeStatus !== 'ALL' && updated.status !== activeStatus) {
      setBookings(prev => prev.filter(b => b.id !== updated.id))
      return
    }
    setBookings(prev => prev.map(b => (b.id === updated.id ? { ...b, status: updated.status } : b)))
  }

  function handleLoadMore() {
    if (!nextCursor) return
    loadMore(() => getAdminBookingsAction({ ...fetchParams, cursor: nextCursor }))
  }

  const emptyKey =
    activeStatus === 'ALL' ? 'admin_requests_empty_all' : `admin_requests_empty_${activeStatus.toLowerCase()}`

  if (bookings.length === 0) {
    return <BookingsEmpty icon={ClipboardListIcon}>{t[emptyKey]}</BookingsEmpty>
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
              <TableHead>{t.admin_booking_col_status}</TableHead>
              <TableHead>{t.admin_booking_col_total}</TableHead>
              <TableHead>{t.admin_booking_col_deposit}</TableHead>
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
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <StatusBadge status={booking.status} />
                    <PaymentBadge status={booking.paymentStatus} />
                  </div>
                </TableCell>
                <BookingTotalCell booking={booking} />
                <BookingDepositCell booking={booking} />
                <TableCell onClick={e => e.stopPropagation()}>
                  <BookingActions
                    booking={booking}
                    onRefundSuccess={handleRefundSuccess}
                    onRespondSuccess={handleRespondSuccess}
                    onView={() => setSelectedBooking(booking)}
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
      />
    </div>
  )
}

export default function RequestsTable({
  bookings,
  initialNextCursor,
  fetchParams,
  activeStatus = 'ALL',
}: RequestsTableProps) {
  return (
    <div className="space-y-4">
      <StatusFilterPills activeStatus={activeStatus} filters={STATUS_FILTERS} />
      <InnerBookingsTable
        key={activeStatus}
        bookings={bookings}
        initialNextCursor={initialNextCursor}
        fetchParams={fetchParams}
        activeStatus={activeStatus}
      />
    </div>
  )
}
