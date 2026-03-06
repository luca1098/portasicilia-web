'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { CalendarCheck2Icon, MoreHorizontalIcon, EyeIcon, ImageIcon, LoaderIcon } from '@/lib/constants/icons'
import { getAdminBookingsAction } from '@/lib/actions/bookings.actions'
import type { AdminBooking, GetAdminBookingsParams, PaginatedAdminBookings } from '@/lib/api/bookings'

type BookingsTableProps = {
  initialBookings: AdminBooking[]
  initialNextCursor: string | null
  fetchParams: GetAdminBookingsParams
}

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

function PaymentBadge({ status, t }: { status: string; t: Record<string, string> }) {
  const colorMap: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800',
    PAID: 'bg-green-100 text-green-800',
    REFUNDED: 'bg-blue-100 text-blue-800',
    FAILED: 'bg-red-100 text-red-800',
  }

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorMap[status] || 'bg-muted text-muted-foreground'}`}
    >
      {t[`admin_payment_status_${status.toLowerCase()}`] || status}
    </span>
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
    loadMore(() => getAdminBookingsAction({ ...fetchParams, cursor: nextCursor }))
  }

  return (
    <Tabs defaultValue="experiences">
      <TabsList>
        <TabsTrigger value="experiences">{t.admin_bookings_tab_experiences}</TabsTrigger>
        <TabsTrigger value="stays">{t.admin_bookings_tab_stays}</TabsTrigger>
      </TabsList>

      <TabsContent value="experiences" className="mt-4">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
              <CalendarCheck2Icon className="size-6 text-muted-foreground/50" />
            </div>
            <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/70">
              {t.admin_bookings_no_results}
            </p>
          </div>
        ) : (
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
                    <TableHead>{t.admin_booking_col_payment}</TableHead>
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
                              {formatTime(booking.timeSlot.startTime)} -{' '}
                              {formatTime(booking.timeSlot.endTime)}
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
                      <TableCell className="text-sm text-muted-foreground">
                        {booking.depositAmount ? formatCurrency(booking.depositAmount) : '\u2014'}
                      </TableCell>
                      <TableCell>
                        <PaymentBadge status={booking.paymentStatus} t={t} />
                      </TableCell>
                      <TableCell>
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
                          </DropdownMenuContent>
                        </DropdownMenu>
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
        )}
      </TabsContent>

      <TabsContent value="stays" className="mt-4">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
            <CalendarCheck2Icon className="size-6 text-muted-foreground/50" />
          </div>
          <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/70">
            {t.admin_bookings_stays_coming_soon}
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
