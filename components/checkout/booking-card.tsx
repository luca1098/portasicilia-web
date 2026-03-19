'use client'

import { createContext, use } from 'react'
import Image from 'next/image'
import { MapPin, StarIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import {
  computeAvgRating,
  getPriceTierLine,
  buildParticipantSummary,
  type BookingPriceTier,
} from '@/lib/utils/checkout.utils'

// ==================== Context ====================

type BookingCardState = {
  experienceName: string
  coverUrl: string | null
  reviews: Array<{ rating: number }> | null | undefined
  assetLabel?: string | null
  formattedDate: string
  startTime: string
  endTime: string
  street: string
  city: string
  adults: number
  children: number
  infants: number
  totalPrice: number | null
  depositAmount: number | null
  priceTiers: BookingPriceTier[]
  // Stay-specific
  formattedDateTo?: string
  guestSummary?: string
}

const BookingCardContext = createContext<BookingCardState | null>(null)

function useBookingCard() {
  const ctx = use(BookingCardContext)
  if (!ctx) throw new Error('BookingCard sub-components must be used within BookingCard.Provider')
  return ctx
}

// ==================== Provider ====================

function Provider({ data, children }: { data: BookingCardState; children: React.ReactNode }) {
  return <BookingCardContext value={data}>{children}</BookingCardContext>
}

// ==================== Sub-components ====================

function Divider() {
  return <hr className="border-border" />
}

function Header({ variant = 'compact' }: { variant?: 'compact' | 'large' }) {
  const state = useBookingCard()
  const avgRating = computeAvgRating(state.reviews)
  const isLarge = variant === 'large'

  return (
    <div className={`flex gap-4 p-5 ${isLarge ? 'items-start' : ''}`}>
      {state.coverUrl && (
        <div
          className={`relative ${isLarge ? 'h-25' : 'h-15'} aspect-square shrink-0 overflow-hidden rounded-lg`}
        >
          <Image src={state.coverUrl} alt={state.experienceName} fill className="object-cover" />
        </div>
      )}
      <div className={`flex min-w-0 flex-col justify-center ${isLarge ? 'pt-4' : ''}`}>
        <h3 className={`font-semibold leading-snug ${isLarge ? 'text-md' : 'text-sm'}`}>
          {state.experienceName}
        </h3>
        {avgRating !== null && (
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            <span>{avgRating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function DateTime() {
  const state = useBookingCard()
  const t = useTranslation()

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{t.checkout_date_time}</p>
        <p className="text-xs text-muted-foreground">{t.checkout_timezone}</p>
      </div>
      <p className="mt-1 text-sm capitalize text-muted-foreground">{state.formattedDate}</p>
      <p className="text-sm text-muted-foreground">
        {state.startTime} - {state.endTime}
      </p>
    </div>
  )
}

function Address() {
  const state = useBookingCard()
  const t = useTranslation()

  return (
    <div className="px-5 py-4">
      <p className="text-sm font-medium">{t.checkout_address}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {state.street}, {state.city}
      </p>
    </div>
  )
}

function AddressWithIcon() {
  const state = useBookingCard()
  const t = useTranslation()

  return (
    <div className="px-5 py-4">
      <p className="text-sm font-medium">{t.checkout_address}</p>
      <div className="mt-1 flex items-start gap-1.5">
        <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          {state.street}, {state.city}
        </p>
      </div>
    </div>
  )
}

function DateRange() {
  const state = useBookingCard()
  const t = useTranslation()

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{t.checkout_stay_date}</p>
        <p className="text-xs text-muted-foreground">{t.checkout_timezone}</p>
      </div>
      <p className="mt-1 text-sm capitalize text-muted-foreground">
        {state.formattedDate}
        {state.formattedDateTo ? ` - ${state.formattedDateTo}` : ''}
      </p>
    </div>
  )
}

function Guests() {
  const state = useBookingCard()
  const t = useTranslation()

  if (!state.guestSummary) return null

  return (
    <div className="px-5 py-4">
      <p className="text-sm font-medium">{t.checkout_stay_guests}</p>
      <p className="mt-1 text-sm text-muted-foreground">{state.guestSummary}</p>
    </div>
  )
}

function Participants() {
  const state = useBookingCard()
  const t = useTranslation() as Record<string, string>

  return (
    <div className="px-5 py-4">
      <p className="text-sm font-medium">{t.checkout_participants}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {buildParticipantSummary(
          state.adults,
          state.children,
          state.infants,
          t,
          t.checkout_participants_separator
        )}
      </p>
    </div>
  )
}

function PriceDetails() {
  const state = useBookingCard()
  const t = useTranslation() as Record<string, string>

  return (
    <div className="space-y-2 px-5 py-4">
      <p className="text-sm font-medium">{t.checkout_price_detail}</p>
      {state.priceTiers.map(tier => (
        <div key={tier.tierType} className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{getPriceTierLine(tier, t, state.assetLabel)}</span>
          <span className="text-sm text-muted-foreground">{`\u20AC ${Math.round(tier.subtotal)}`}</span>
        </div>
      ))}
    </div>
  )
}

function Total() {
  const state = useBookingCard()
  const t = useTranslation()

  if (state.totalPrice === null) return null

  return (
    <>
      <Divider />
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm font-bold">{t.checkout_total_eur}</span>
        <span className="text-sm font-bold">{`\u20AC ${Math.round(state.totalPrice)}`}</span>
      </div>
    </>
  )
}

function DepositNote() {
  const state = useBookingCard()
  const t = useTranslation()

  if (state.depositAmount === null || state.depositAmount <= 0) return null

  const depositStr = `\u20AC ${Math.round(state.depositAmount)}`
  const fullText = interpolate(t.checkout_deposit_note, { amount: depositStr })
  const parts = fullText.split(depositStr)

  return (
    <>
      <Divider />
      <div className="px-5 py-4">
        <p className="text-center text-xs text-muted-foreground">
          {parts[0]}
          <span className="font-semibold">{depositStr}</span>
          {parts[1]}
        </p>
      </div>
    </>
  )
}

function DepositPaid() {
  const state = useBookingCard()
  const t = useTranslation()

  if (state.depositAmount === null || state.depositAmount <= 0) return null

  return (
    <div className="mx-5 mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/40">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          {t.booking_success_deposit_paid}
        </span>
        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          {`\u20AC ${Math.round(state.depositAmount)}`}
        </span>
      </div>
      {state.totalPrice !== null && state.totalPrice - state.depositAmount > 0 && (
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-xs text-emerald-600/70 dark:text-emerald-500/70">
            {t.booking_success_remaining_on_site}
          </span>
          <span className="text-xs text-emerald-600/70 dark:text-emerald-500/70">
            {`\u20AC ${Math.round(state.totalPrice - state.depositAmount)}`}
          </span>
        </div>
      )}
    </div>
  )
}

// ==================== Export ====================

export const BookingCard = {
  Provider,
  Divider,
  Header,
  DateTime,
  DateRange,
  Address,
  AddressWithIcon,
  Participants,
  Guests,
  PriceDetails,
  Total,
  DepositNote,
  DepositPaid,
}
