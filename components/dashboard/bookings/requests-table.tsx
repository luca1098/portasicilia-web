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
  { key: 'CANCELLED', labelKey: 'admin_booking_status_cancelled' },
  { key: 'NO_SHOW', labelKey: 'admin_booking_status_no_show' },
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatTime(time: string) {
  return time.slice(0, 5)
}

function formatCurrency(value: string) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(Number(value))
}

function StatusBadge({ status, t }: { status: string; t: Record<string, string> }) {
  const colorMap: Record<string, string> = {
    PENDING_APPROVAL: 'bg-amber-100 text-amber-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    NO_SHOW: 'bg-gray-100 text-gray-500',
  }

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorMap[status] || 'bg-muted text-muted-foreground'}`}
    >
      {t[`admin_booking_status_${status.toLowerCase()}`] || status}
    </span>
  )
}

function PaymentBadge({ status, t }: { status: string; t: Record<string, string> }) {
  if (status !== 'REFUNDED') return null
  return (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
      {t.admin_booking_payment_refunded}
    </span>
  )
}

function StatusFilterPills({ activeStatus, t }: { activeStatus: string; t: Record<string, string> }) {
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
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
  t,
  onRefundSuccess,
}: {
  booking: AdminBooking
  t: Record<string, string>
  onRefundSuccess: (bookingId: string) => void
}) {
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)

  const { loading: refundLoading, execute: executeRefund } = useAction<AdminBooking>({
    successMessage: t.admin_booking_refund_success,
    onSuccess: () => onRefundSuccess(booking.id),
  })

  const isPending = booking.status === 'PENDING_APPROVAL'
  const isRefundable =
    (booking.status === 'REJECTED' || booking.status === 'CANCELLED') && booking.paymentStatus !== 'REFUNDED'
  const isRefunded =
    (booking.status === 'REJECTED' || booking.status === 'CANCELLED') && booking.paymentStatus === 'REFUNDED'

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
  t,
}: {
  bookings: AdminBooking[]
  initialNextCursor: string | null
  fetchParams: GetAdminBookingsParams
  activeStatus: string
  t: Record<string, string>
}) {
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
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">{t[emptyKey]}</p>
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
                    <StatusBadge status={booking.status} t={t} />
                    <PaymentBadge status={booking.paymentStatus} t={t} />
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {booking.priceSnapshot ? formatCurrency(booking.priceSnapshot.total) : '\u2014'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {booking.depositAmount ? formatCurrency(booking.depositAmount) : '\u2014'}
                </TableCell>
                <TableCell>
                  <BookingActions booking={booking} t={t} onRefundSuccess={handleRefundSuccess} />
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
        <StatusFilterPills activeStatus={activeStatus} t={t} />
        <InnerBookingsTable
          key={activeStatus}
          bookings={bookings}
          initialNextCursor={initialNextCursor}
          fetchParams={fetchParams}
          activeStatus={activeStatus}
          t={t}
        />
      </TabsContent>

      <TabsContent value="stays" className="mt-4">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">{t.admin_requests_stays_coming_soon}</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
