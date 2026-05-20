'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { ExternalLinkIcon, ImageIcon, XIcon } from '@/lib/constants/icons'
import { StatusBadge } from '@/components/dashboard/bookings/status-badge'
import { PaymentStatusBadge } from '@/components/dashboard/bookings/booking-cells'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils/format.utils'
import { isBookingCancellable, shouldObscurePersonalData } from '@/lib/utils/booking.utils'
import CancelBookingDialog from '@/components/dashboard/user/cancel-booking-dialog'
import type { AdminBooking } from '@/lib/api/bookings'

type BookingDialogProps = {
  booking: AdminBooking | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancelled?: (bookingId: string) => void
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  )
}

function BookingHeader({ booking }: { booking: AdminBooking }) {
  return (
    <div className="flex items-start gap-4">
      {booking.listing.cover ? (
        <Image
          src={booking.listing.cover}
          alt={booking.listing.name}
          width={64}
          height={64}
          className="size-16 rounded-lg object-cover"
          unoptimized
        />
      ) : (
        <div className="flex size-16 items-center justify-center rounded-lg bg-muted">
          <ImageIcon className="size-6 text-muted-foreground" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1.5">
        <p className="text-base font-semibold leading-tight">{booking.listing.name}</p>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={booking.status} />
          <PaymentStatusBadge status={booking.paymentStatus} />
        </div>
      </div>
    </div>
  )
}

function BookingDateField({ booking }: { booking: AdminBooking }) {
  const t = useTranslation() as Record<string, string>
  const isStay = booking.listing.type === 'STAY'

  if (isStay) {
    return (
      <>
        <Field label={t.booking_detail_checkin} value={formatDate(booking.date)} />
        <Field label={t.booking_detail_checkout} value={booking.dateTo ? formatDate(booking.dateTo) : '—'} />
      </>
    )
  }

  return (
    <Field
      label={t.owner_detail_date}
      value={
        <>
          <span>{formatDate(booking.date)}</span>
          {booking.dateTo && <span className="text-muted-foreground"> – {formatDate(booking.dateTo)}</span>}
          {booking.timeSlot && (
            <span className="text-muted-foreground">
              {' '}
              {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
            </span>
          )}
        </>
      }
    />
  )
}

function ParticipantsField({ booking }: { booking: AdminBooking }) {
  const t = useTranslation() as Record<string, string>
  return (
    <Field
      label={t.owner_detail_participants}
      value={
        <div className="space-y-0.5">
          {booking.participants.map(p => (
            <p key={p.type}>
              {p.quantity}x {t[`owner_participant_${p.type.toLowerCase()}`] || p.type}
            </p>
          ))}
        </div>
      }
    />
  )
}

function CustomerField({ booking }: { booking: AdminBooking }) {
  const t = useTranslation() as Record<string, string>
  const customerName =
    [booking.user.firstName, booking.user.lastName].filter(Boolean).join(' ').trim() || booking.user.email
  return (
    <Field
      label={t.booking_detail_customer}
      value={
        <div className="space-y-0.5">
          <p>{customerName}</p>
          <p className="text-xs text-muted-foreground">{booking.user.email}</p>
        </div>
      }
    />
  )
}

function MaskedCustomerField() {
  const t = useTranslation() as Record<string, string>
  return (
    <Field
      label={t.booking_detail_customer}
      value={
        <div className="space-y-0.5">
          <p>••••••• •••••••</p>
          <p className="text-xs italic text-muted-foreground">{t.booking_detail_hidden_until_confirm}</p>
        </div>
      }
    />
  )
}

function ContactField({ booking }: { booking: AdminBooking }) {
  const t = useTranslation() as Record<string, string>
  return (
    <Field
      label={t.booking_detail_contact}
      value={
        <div className="space-y-0.5">
          <p>{booking.contactEmail}</p>
          <p className="text-muted-foreground">{booking.contactPhone}</p>
        </div>
      }
    />
  )
}

function MaskedContactField() {
  const t = useTranslation() as Record<string, string>
  return (
    <Field
      label={t.booking_detail_contact}
      value={
        <div className="space-y-0.5">
          <p>•••••@•••••</p>
          <p className="text-muted-foreground">+•• ••• ••• ••••</p>
        </div>
      }
    />
  )
}

function PaymentField({ booking }: { booking: AdminBooking }) {
  const t = useTranslation() as Record<string, string>
  return (
    <Field
      label={t.owner_detail_payment}
      value={
        <div className="space-y-0.5">
          <p>
            {t.admin_booking_col_total}:{' '}
            {booking.priceSnapshot ? formatCurrency(booking.priceSnapshot.total) : '—'}
          </p>
          {booking.depositAmount && (
            <p className="text-muted-foreground">
              {t.admin_booking_col_deposit}: {formatCurrency(booking.depositAmount)}
            </p>
          )}
        </div>
      }
    />
  )
}

function CreatedAtField({ booking }: { booking: AdminBooking }) {
  const t = useTranslation() as Record<string, string>
  return <Field label={t.booking_detail_created_at} value={formatDate(booking.createdAt)} />
}

function PriceBreakdown({ booking }: { booking: AdminBooking }) {
  const t = useTranslation() as Record<string, string>
  if (!booking.priceSnapshot || booking.priceSnapshot.lineItems.length === 0) return null

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {t.owner_detail_price_breakdown}
      </p>
      <div className="mt-2 divide-y divide-border rounded-lg border border-border">
        {booking.priceSnapshot.lineItems.map((item, i) => (
          <div key={i} className="flex items-center justify-between px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              {item.quantity}x {item.label}
            </span>
            <span className="font-medium">{formatCurrency(item.subtotal)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ViewOnStripeButton({ booking }: { booking: AdminBooking }) {
  const t = useTranslation() as Record<string, string>
  if (!booking.stripePaymentIntentId) return null
  return (
    <Button variant="outline" asChild>
      <a
        href={`https://dashboard.stripe.com/payments/${booking.stripePaymentIntentId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ExternalLinkIcon className="size-4" />
        {t.admin_booking_action_view_on_stripe}
      </a>
    </Button>
  )
}

function CancelButton({ onClick }: { onClick: () => void }) {
  const t = useTranslation() as Record<string, string>
  return (
    <Button variant="outline" onClick={onClick} className="text-destructive hover:text-destructive">
      <XIcon className="size-4" />
      {t.user_cancel_action}
    </Button>
  )
}

function CloseButton({ onClick }: { onClick: () => void }) {
  const t = useTranslation() as Record<string, string>
  return (
    <Button variant="outline" onClick={onClick}>
      {t.booking_detail_close}
    </Button>
  )
}

function DialogShell({
  booking,
  open,
  onOpenChange,
  children,
}: {
  booking: AdminBooking
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}) {
  const t = useTranslation() as Record<string, string>
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.booking_detail_title}</DialogTitle>
          <DialogDescription className="sr-only">{booking.listing.name}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

function FieldsGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>
}

function FooterBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
      {children}
    </div>
  )
}

export function AdminBookingDetailDialog({ booking, open, onOpenChange, onCancelled }: BookingDialogProps) {
  const [cancelOpen, setCancelOpen] = useState(false)
  if (!booking) return null

  const canCancel = isBookingCancellable(booking)

  return (
    <>
      <DialogShell booking={booking} open={open} onOpenChange={onOpenChange}>
        <BookingHeader booking={booking} />
        <FieldsGrid>
          <BookingDateField booking={booking} />
          <ParticipantsField booking={booking} />
          <CustomerField booking={booking} />
          <ContactField booking={booking} />
          <PaymentField booking={booking} />
          <CreatedAtField booking={booking} />
        </FieldsGrid>
        <PriceBreakdown booking={booking} />
        <FooterBar>
          <ViewOnStripeButton booking={booking} />
          {canCancel && <CancelButton onClick={() => setCancelOpen(true)} />}
          <CloseButton onClick={() => onOpenChange(false)} />
        </FooterBar>
      </DialogShell>

      <CancelBookingDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        bookingId={booking.id}
        onSuccess={() => {
          onCancelled?.(booking.id)
          onOpenChange(false)
        }}
      />
    </>
  )
}

export function OwnerBookingDetailDialog({ booking, open, onOpenChange, onCancelled }: BookingDialogProps) {
  const [cancelOpen, setCancelOpen] = useState(false)
  if (!booking) return null

  const obscure = shouldObscurePersonalData(booking)
  const canCancel = isBookingCancellable(booking)

  return (
    <>
      <DialogShell booking={booking} open={open} onOpenChange={onOpenChange}>
        <BookingHeader booking={booking} />
        <FieldsGrid>
          <BookingDateField booking={booking} />
          <ParticipantsField booking={booking} />
          {obscure ? <MaskedCustomerField /> : <CustomerField booking={booking} />}
          {obscure ? <MaskedContactField /> : <ContactField booking={booking} />}
          <PaymentField booking={booking} />
          <CreatedAtField booking={booking} />
        </FieldsGrid>
        <PriceBreakdown booking={booking} />
        <FooterBar>
          {canCancel && <CancelButton onClick={() => setCancelOpen(true)} />}
          <CloseButton onClick={() => onOpenChange(false)} />
        </FooterBar>
      </DialogShell>

      <CancelBookingDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        bookingId={booking.id}
        onSuccess={() => {
          onCancelled?.(booking.id)
          onOpenChange(false)
        }}
      />
    </>
  )
}
