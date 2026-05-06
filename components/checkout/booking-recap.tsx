'use client'

import { useTranslation } from '@/lib/context/translation.context'
import { buildParticipantSummary } from '@/lib/utils/checkout.utils'
import { parseDate } from '@/lib/utils/date.utils'
import useCheckoutStore from '@/core/store/checkout.store'
import { BookingCard } from './booking-card'

export default function BookingRecap() {
  const t = useTranslation() as Record<string, string>
  const bookingContext = useCheckoutStore(s => s.bookingContext)

  if (!bookingContext) return null

  const {
    listingType,
    experience,
    stay,
    date,
    dateTo,
    startTime,
    endTime,
    adults,
    children,
    infants,
    totalPrice,
    depositAmount,
    priceTiers,
  } = bookingContext

  const isStay = listingType === 'STAY'
  const listing = isStay ? stay : experience

  const formatOpts: Intl.DateTimeFormatOptions = isStay
    ? { day: 'numeric', month: 'long', year: 'numeric' }
    : { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }

  const formattedDate = parseDate(date).toLocaleDateString('it-IT', formatOpts)
  const formattedDateTo = dateTo ? parseDate(dateTo).toLocaleDateString('it-IT', formatOpts) : undefined

  const coverUrl = listing?.images?.[0]?.url ?? listing?.cover ?? null
  const guestSummary = isStay
    ? buildParticipantSummary(adults, children, infants, t, t.checkout_participants_separator)
    : undefined

  return (
    <BookingCard.Provider
      data={{
        experienceName: listing?.name ?? '',
        coverUrl,
        reviews: listing?.reviews,
        assetLabel: isStay ? undefined : experience?.assetLabel,
        formattedDate,
        formattedDateTo,
        startTime: startTime ?? '',
        endTime: endTime ?? '',
        street: listing?.street ?? '',
        city: listing?.city ?? '',
        adults,
        children,
        infants,
        totalPrice,
        depositAmount,
        priceTiers,
        guestSummary,
      }}
    >
      <aside className="rounded-xl border bg-background" aria-label={t.checkout_booking_summary}>
        <BookingCard.Header />
        <BookingCard.Divider />
        {isStay ? (
          <>
            <BookingCard.DateRange />
            <BookingCard.Divider />
            <BookingCard.Guests />
          </>
        ) : (
          <>
            <BookingCard.DateTime />
            <BookingCard.Divider />
            <BookingCard.Address />
            <BookingCard.Divider />
            <BookingCard.Participants />
          </>
        )}
        <BookingCard.Divider />
        <BookingCard.PriceDetails />
        <BookingCard.Total />
        <BookingCard.DepositNote />
      </aside>
    </BookingCard.Provider>
  )
}
