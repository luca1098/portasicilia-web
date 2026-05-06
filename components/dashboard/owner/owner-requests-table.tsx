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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { InputWrapper } from '@/components/form/input-wrapper'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { useCounterProposals } from '@/lib/hooks/use-counter-proposals'
import {
  ClipboardListIcon,
  MoreHorizontalIcon,
  CheckIcon,
  XIcon,
  CalendarIcon,
  ImageIcon,
  LoaderIcon,
} from '@/lib/constants/icons'
import { formatDate, formatTime } from '@/lib/utils/format.utils'
import { StatusBadge } from '@/components/dashboard/bookings/status-badge'
import ProposalCards from '@/components/shared/proposal-cards'
import {
  ownerRespondBookingAction,
  getOwnerBookingsAction,
  getExperienceTimeSlotsAction,
} from '@/lib/actions/owner-bookings.actions'
import type { ExperienceTimeSlot } from '@/lib/schemas/entities/experience.entity.schema'
import type { AdminBooking, GetAdminBookingsParams, PaginatedAdminBookings } from '@/lib/api/bookings'

type OwnerRequestsTableProps = {
  bookings: AdminBooking[]
  initialNextCursor: string | null
  fetchParams: GetAdminBookingsParams
  activeStatus?: string
}

const STATUS_FILTERS = [
  { key: 'ALL', labelKey: 'owner_requests_filter_all' },
  { key: 'PENDING_APPROVAL', labelKey: 'admin_booking_status_pending_approval' },
  { key: 'COUNTER_PROPOSED', labelKey: 'admin_booking_status_counter_proposed' },
  { key: 'REJECTED', labelKey: 'admin_booking_status_rejected' },
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

function CounterProposalDialog({
  open,
  onOpenChange,
  booking,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: AdminBooking
  onSuccess: () => void
}) {
  const t = useTranslation() as Record<string, string>
  const {
    proposals,
    message,
    allValid,
    setMessage,
    addProposal,
    removeProposal,
    updateProposal,
    reset,
    getValidProposals,
  } = useCounterProposals()

  const [timeSlots, setTimeSlots] = useState<ExperienceTimeSlot[]>([])

  const { loading: timeSlotsLoading, execute: fetchTimeSlots } = useAction<ExperienceTimeSlot[]>({
    onSuccess: data => {
      if (data) setTimeSlots(data)
    },
  })

  const { loading: counterLoading, execute: executeCounter } = useAction<AdminBooking>({
    successMessage: t.owner_request_counter_success,
    onSuccess,
  })

  function handleOpen(isOpen: boolean) {
    if (isOpen) {
      reset()
      fetchTimeSlots(() => getExperienceTimeSlotsAction(booking.listing.id))
    } else {
      reset()
      setTimeSlots([])
    }
    onOpenChange(isOpen)
  }

  function handleSubmit() {
    if (!allValid) return
    const counterProposals = getValidProposals()
    executeCounter(() =>
      ownerRespondBookingAction(booking.id, 'REJECT', counterProposals, message || undefined)
    )
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.owner_request_counter_title}</DialogTitle>
          <DialogDescription>{t.owner_request_counter_desc}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {timeSlotsLoading ? (
            <div className="flex items-center justify-center py-6">
              <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <ProposalCards
                proposals={proposals}
                timeSlots={timeSlots}
                labels={{
                  proposalLabel: t.owner_request_counter_proposal_label,
                  removeLabel: t.owner_request_counter_remove,
                  dateLabel: t.owner_request_counter_select_date,
                  timeslotLabel: t.owner_request_counter_select_timeslot,
                  addDateLabel: t.owner_request_counter_add_date,
                }}
                onUpdate={updateProposal}
                onRemove={removeProposal}
                onAdd={addProposal}
              />
              <InputWrapper label={t.owner_request_counter_message} hasValue={!!message}>
                <Textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={t.owner_request_counter_message_placeholder}
                  maxLength={1000}
                  rows={3}
                />
              </InputWrapper>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.admin_common_cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={counterLoading || !allValid}>
            {counterLoading && <LoaderIcon className="size-4 animate-spin" />}
            {t.owner_request_counter_submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RequestActions({
  booking,
  onStatusChange,
}: {
  booking: AdminBooking
  onStatusChange: (bookingId: string, newStatus: string) => void
}) {
  const t = useTranslation() as Record<string, string>
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [counterDialogOpen, setCounterDialogOpen] = useState(false)

  const isPending = booking.status === 'PENDING_APPROVAL'

  const { loading: confirmLoading, execute: executeConfirm } = useAction<AdminBooking>({
    successMessage: t.owner_request_confirm_success,
    onSuccess: () => onStatusChange(booking.id, 'CONFIRMED'),
  })

  const { loading: rejectLoading, execute: executeReject } = useAction<AdminBooking>({
    successMessage: t.owner_request_reject_success,
    onSuccess: () => onStatusChange(booking.id, 'REJECTED'),
  })

  function handleConfirm() {
    executeConfirm(() => ownerRespondBookingAction(booking.id, 'CONFIRM'))
  }

  function handleReject() {
    executeReject(() => ownerRespondBookingAction(booking.id, 'REJECT'))
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
          {isPending ? (
            <>
              <DropdownMenuItem onSelect={() => setConfirmDialogOpen(true)}>
                <CheckIcon className="size-4" />
                {t.owner_request_action_confirm}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setRejectDialogOpen(true)} variant="destructive">
                <XIcon className="size-4" />
                {t.owner_request_action_reject}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setCounterDialogOpen(true)}>
                <CalendarIcon className="size-4" />
                {t.owner_request_action_counter}
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem disabled>
              <CheckIcon className="size-4" />
              {t[`admin_booking_status_${booking.status.toLowerCase()}`] || booking.status}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.owner_request_confirm_title}</AlertDialogTitle>
            <AlertDialogDescription>{t.owner_request_confirm_desc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.admin_common_cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={confirmLoading}>
              {t.owner_request_action_confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.owner_request_reject_title}</AlertDialogTitle>
            <AlertDialogDescription>{t.owner_request_reject_desc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.admin_common_cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={rejectLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t.owner_request_action_reject}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CounterProposalDialog
        open={counterDialogOpen}
        onOpenChange={setCounterDialogOpen}
        booking={booking}
        onSuccess={() => onStatusChange(booking.id, 'COUNTER_PROPOSED')}
      />
    </>
  )
}

function InnerRequestsTable({
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

  const emptyKey =
    activeStatus === 'ALL' ? 'owner_requests_empty_all' : `owner_requests_empty_${activeStatus.toLowerCase()}`

  function handleStatusChange(bookingId: string, newStatus: string) {
    setBookings(prev => prev.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b)))
  }

  function handleLoadMore() {
    if (!nextCursor) return
    loadMore(() => getOwnerBookingsAction({ ...fetchParams, cursor: nextCursor }))
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
          <ClipboardListIcon className="size-6 text-muted-foreground/50" />
        </div>
        <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/70">
          {t[emptyKey] || t.owner_requests_empty_all}
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
              <TableHead>{t.owner_col_status}</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map(booking => (
              <TableRow key={booking.id}>
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
                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                <TableCell>
                  <RequestActions booking={booking} onStatusChange={handleStatusChange} />
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

export default function OwnerRequestsTable({
  bookings,
  initialNextCursor,
  fetchParams,
  activeStatus = 'ALL',
}: OwnerRequestsTableProps) {
  return (
    <div className="space-y-4">
      <StatusFilterPills activeStatus={activeStatus} />
      <InnerRequestsTable
        key={activeStatus}
        bookings={bookings}
        initialNextCursor={initialNextCursor}
        fetchParams={fetchParams}
        activeStatus={activeStatus}
      />
    </div>
  )
}
