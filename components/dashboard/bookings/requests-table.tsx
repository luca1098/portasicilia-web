'use client'

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
import { MoreHorizontalIcon, EyeIcon, CheckIcon, XIcon, ImageIcon } from '@/lib/constants/icons'
import type { AdminBooking } from '@/lib/api/bookings'

type RequestsTableProps = {
  bookings: AdminBooking[]
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

export default function RequestsTable({ bookings }: RequestsTableProps) {
  const t = useTranslation() as Record<string, string>

  return (
    <Tabs defaultValue="experiences">
      <TabsList>
        <TabsTrigger value="experiences">{t.admin_requests_tab_experiences}</TabsTrigger>
        <TabsTrigger value="stays">{t.admin_requests_tab_stays}</TabsTrigger>
      </TabsList>

      <TabsContent value="experiences" className="mt-4">
        {bookings.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">{t.admin_requests_no_results}</p>
          </div>
        ) : (
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
                      <StatusBadge status={booking.status} t={t} />
                    </TableCell>
                    <TableCell className="text-sm">
                      {booking.priceSnapshot ? formatCurrency(booking.priceSnapshot.total) : '\u2014'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {booking.depositAmount ? formatCurrency(booking.depositAmount) : '\u2014'}
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
                          <DropdownMenuItem>
                            <CheckIcon className="size-4" />
                            {t.admin_booking_action_confirm}
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive">
                            <XIcon className="size-4" />
                            {t.admin_booking_action_reject}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      <TabsContent value="stays" className="mt-4">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">{t.admin_requests_stays_coming_soon}</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
