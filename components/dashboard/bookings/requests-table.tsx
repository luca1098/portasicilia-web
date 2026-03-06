'use client'

import { useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import {
  ClipboardListIcon,
  MoreHorizontalIcon,
  EyeIcon,
  CheckIcon,
  XIcon,
  ImageIcon,
  RotateCcwIcon,
  LoaderIcon,
} from '@/lib/constants/icons'
import { refundBooking } from '@/lib/api/bookings'
import { getAdminBookingsAction } from '@/lib/actions/bookings.actions'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils/format.utils'
import { StatusBadge, PaymentBadge } from '@/components/dashboard/bookings/status-badge'
import type { AdminBooking, GetAdminBookingsParams, PaginatedAdminBookings } from '@/lib/api/bookings'

type RequestsTableProps = {
  bookings: AdminBooking[]
  initialNextCursor: string | null
  fetchParams: GetAdminBookingsParams
  activeStatus?: string
}

const STATUS_FILTERS = [
  { key: 'ALL', labelKey: 'admin_requests_filter_all' },
  { key: 'PENDING_APPROVAL', labelKey: 'admin_booking_status_pending_approval' },
  { key: 'REJECTED', labelKey: 'admin_booking_status_rejected' },
  { key: 'COUNTER_PROPOSED', labelKey: 'admin_booking_status_counter_proposed' },
  { key: 'CANCELLED', labelKey: 'admin_booking_status_cancelled' },
  { key: 'NO_SHOW', labelKey: 'admin_booking_status_no_show' },
]

function StatusFilterPills({ activeStatus }: { activeStatus: string }) {
  const t = useTranslation() as Record<string, string>
  const router = useRouter()
  const pathname = usePathname()

  function handleFilter(key: string) {
    if (key === 'ALL') {
      router.replace(pathname)
    } else {
      router.replace(`${pathname}?status=${key}`)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_FILTERS.map(filter => {
        const isActive = activeStatus === filter.key
        return (
          <button
            key={filter.key}
            onClick={() => handleFilter(filter.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {t[filter.labelKey] || filter.key}
          </button>
        )
      })}
    </div>
  )
}

function BookingActions({
  booking,
  onRefundSuccess,
}: {
  booking: AdminBooking
  onRefundSuccess: (bookingId: string) => void
}) {
  const t = useTranslation() as Record<string, string>
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)

  const { loading: refundLoading, execute: executeRefund } = useAction<AdminBooking>({
    successMessage: t.admin_booking_refund_success,
    onSuccess: () => onRefundSuccess(booking.id),
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
    executeRefund(async () => {
      const data = await refundBooking(booking.id)
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
          <DropdownMenuItem>
            <EyeIcon className="size-4" />
            {t.admin_booking_action_view}
          </DropdownMenuItem>
          {isPending && (
            <>
              <DropdownMenuItem>
                <CheckIcon className="size-4" />
                {t.admin_booking_action_confirm}
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
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

  function handleLoadMore() {
    if (!nextCursor) return
    loadMore(() => getAdminBookingsAction({ ...fetchParams, cursor: nextCursor }))
  }

  const emptyKey =
    activeStatus === 'ALL' ? 'admin_requests_empty_all' : `admin_requests_empty_${activeStatus.toLowerCase()}`

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
          <ClipboardListIcon className="size-6 text-muted-foreground/50" />
        </div>
        <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/70">{t[emptyKey]}</p>
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
              <TableRow key={booking.id}>
                <TableCell>
                  {booking.experience.cover ? (
                    <Image
                      src={booking.experience.cover}
                      alt={booking.experience.name}
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
                <TableCell className="font-medium">{booking.experience.name}</TableCell>
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
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <StatusBadge status={booking.status} />
                    <PaymentBadge status={booking.paymentStatus} />
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {booking.priceSnapshot ? formatCurrency(booking.priceSnapshot.total) : '\u2014'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {booking.depositAmount ? formatCurrency(booking.depositAmount) : '\u2014'}
                </TableCell>
                <TableCell>
                  <BookingActions booking={booking} onRefundSuccess={handleRefundSuccess} />
                </TableCell>
              </TableRow>
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

export default function RequestsTable({
  bookings,
  initialNextCursor,
  fetchParams,
  activeStatus = 'ALL',
}: RequestsTableProps) {
  const t = useTranslation() as Record<string, string>

  return (
    <Tabs defaultValue="experiences">
      <TabsList>
        <TabsTrigger value="experiences">{t.admin_requests_tab_experiences}</TabsTrigger>
        <TabsTrigger value="stays">{t.admin_requests_tab_stays}</TabsTrigger>
      </TabsList>

      <TabsContent value="experiences" className="mt-4 space-y-4">
        <StatusFilterPills activeStatus={activeStatus} />
        <InnerBookingsTable
          key={activeStatus}
          bookings={bookings}
          initialNextCursor={initialNextCursor}
          fetchParams={fetchParams}
          activeStatus={activeStatus}
        />
      </TabsContent>

      <TabsContent value="stays" className="mt-4">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
            <ClipboardListIcon className="size-6 text-muted-foreground/50" />
          </div>
          <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/70">
            {t.admin_requests_stays_coming_soon}
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
