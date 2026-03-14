'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/dashboard/bookings/status-badge'
import { useTranslation } from '@/lib/context/translation.context'
import {
  CalendarIcon,
  ChevronDownIcon,
  ClockIcon,
  ImageIcon,
  MessageSquareIcon,
  UsersIcon,
  XIcon,
} from '@/lib/constants/icons'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils/format.utils'
import { cn } from '@/lib/utils/shadcn.utils'
import { useUserBookings } from './user-bookings-provider'
import CancelBookingDialog from './cancel-booking-dialog'
import AcceptProposalDialog from './accept-proposal-dialog'
import type { UserBooking } from '@/lib/api/user-bookings'

export default function UserBookingCard({ booking }: { booking: UserBooking }) {
  const t = useTranslation() as Record<string, string>
  const { actions } = useUserBookings()
  const [expanded, setExpanded] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [acceptOpen, setAcceptOpen] = useState(false)

  const isCounterProposed = booking.status === 'COUNTER_PROPOSED'
  const canCancel = booking.status === 'PENDING_APPROVAL' || booking.status === 'CONFIRMED'
  const counterProposals =
    isCounterProposed && booking.counterProposals?.length ? booking.counterProposals : null

  return (
    <>
      <div
        className={cn(
          'overflow-hidden rounded-xl border border-border bg-card transition-colors',
          isCounterProposed && 'border-l-4 border-l-orange-400 bg-orange-50/50 dark:bg-orange-950/10'
        )}
      >
        {/* Main card row */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-accent/30"
        >
          {/* Thumbnail */}
          {booking.listing.cover ? (
            <Image
              src={booking.listing.cover}
              alt={booking.listing.name}
              width={96}
              height={96}
              className="size-20 shrink-0 rounded-xl object-cover sm:size-24"
              unoptimized
            />
          ) : (
            <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-muted sm:size-24">
              <ImageIcon className="size-6 text-muted-foreground" />
            </div>
          )}

          {/* Info */}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-base font-semibold">{booking.listing.name}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarIcon className="size-3.5" />
                {formatDate(booking.date)}
              </span>
              {booking.timeSlot && (
                <span className="flex items-center gap-1">
                  <ClockIcon className="size-3.5" />
                  {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <UsersIcon className="size-3.5" />
                {booking.totalPax}
              </span>
            </div>
          </div>

          {/* Right side: amount + status + chevron */}
          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden flex-col items-end gap-1 sm:flex">
              <span className="text-sm font-semibold tabular-nums">
                {booking.priceSnapshot ? formatCurrency(booking.priceSnapshot.total) : '\u2014'}
              </span>
              <StatusBadge status={booking.status} />
            </div>
            <ChevronDownIcon
              className={cn(
                'size-4 text-muted-foreground transition-transform duration-200',
                expanded && 'rotate-180'
              )}
            />
          </div>
        </button>

        {/* Mobile status (visible on small screens) */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 sm:hidden">
          <StatusBadge status={booking.status} />
          <span className="text-sm font-semibold tabular-nums">
            {booking.priceSnapshot ? formatCurrency(booking.priceSnapshot.total) : '\u2014'}
          </span>
        </div>

        {/* Expanded details */}
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-in-out"
          style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <div className="border-t border-border bg-muted/30 px-4 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Date & Time */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t.user_detail_date}
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

                {/* Participants */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t.user_detail_participants}
                  </p>
                  <div className="mt-1 space-y-0.5">
                    {booking.participants.map(p => (
                      <p key={p.type} className="text-sm">
                        {p.quantity}x {t[`owner_participant_${p.type.toLowerCase()}`] || p.type}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t.user_detail_payment}
                  </p>
                  <div className="mt-1 space-y-0.5 text-sm">
                    <p>
                      {t.user_detail_total}:{' '}
                      {booking.priceSnapshot ? formatCurrency(booking.priceSnapshot.total) : '\u2014'}
                    </p>
                    {booking.depositAmount && (
                      <p className="text-muted-foreground">
                        {t.user_detail_deposit}: {formatCurrency(booking.depositAmount)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price breakdown */}
                {booking.priceSnapshot && booking.priceSnapshot.lineItems.length > 0 && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t.user_detail_price_breakdown}
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

              {/* Owner response message */}
              {booking.responseMessage && (
                <div className="mt-4 rounded-lg border-l-4 border-primary/30 bg-background p-3 pl-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <MessageSquareIcon className="size-3.5" />
                    {t.user_detail_owner_message}
                  </div>
                  <p className="mt-1.5 text-sm italic">{booking.responseMessage}</p>
                </div>
              )}

              {/* Counter-proposals */}
              {counterProposals && (
                <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-900/50 dark:bg-orange-950/20">
                  <p className="text-xs font-medium uppercase tracking-wider text-orange-700 dark:text-orange-400">
                    {t.user_detail_counter_proposals}
                  </p>
                  <div className="mt-2 space-y-2">
                    {counterProposals.map((proposal, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="size-3.5 text-orange-600 dark:text-orange-400" />
                        <span>{formatDate(proposal.date)}</span>
                        {proposal.timeSlot && (
                          <>
                            <ClockIcon className="size-3.5 text-orange-600 dark:text-orange-400" />
                            <span>
                              {formatTime(proposal.timeSlot.startTime)} -{' '}
                              {formatTime(proposal.timeSlot.endTime)}
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="mt-3 bg-orange-500 text-white hover:bg-orange-600"
                    onClick={() => setAcceptOpen(true)}
                  >
                    {t.user_accept_proposal_action}
                  </Button>
                </div>
              )}

              {/* Actions */}
              {canCancel && (
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => setCancelOpen(true)}>
                    <XIcon className="size-4" />
                    {t.user_cancel_action}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CancelBookingDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        bookingId={booking.id}
        onSuccess={() => actions.handleStatusChange(booking.id, 'CANCELLED')}
      />

      {counterProposals && (
        <AcceptProposalDialog
          open={acceptOpen}
          onOpenChange={setAcceptOpen}
          bookingId={booking.id}
          proposals={counterProposals}
          onSuccess={() => actions.handleStatusChange(booking.id, 'CONFIRMED')}
        />
      )}
    </>
  )
}
