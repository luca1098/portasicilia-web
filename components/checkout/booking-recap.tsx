'use client'

import { useTranslation } from '@/lib/context/translation.context'
import { parseDate } from '@/lib/utils/date.utils'
import useCheckoutStore from '@/core/store/checkout.store'
import { BookingCard } from './booking-card'

export default function BookingRecap() {
  const t = useTranslation()
  const bookingContext = useCheckoutStore(s => s.bookingContext)

  if (!bookingContext) return null

  const {
    experience,
    date,
    startTime,
    endTime,
    adults,
    children,
    infants,
    totalPrice,
    depositAmount,
    priceTiers,
  } = bookingContext

  const formattedDate = parseDate(date).toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const coverUrl = experience.images?.[0]?.url ?? experience.cover

  return (
    <BookingCard.Provider
      data={{
        experienceName: experience.name,
        coverUrl,
        reviews: experience.reviews,
        assetLabel: experience.assetLabel,
        formattedDate,
        startTime,
        endTime,
        street: experience.street,
        city: experience.city,
        adults,
        children,
        infants,
        totalPrice,
        depositAmount,
        priceTiers,
      }}
    >
      <aside className="rounded-xl border bg-background" aria-label={t.checkout_booking_summary}>
        <BookingCard.Header />
        <BookingCard.Divider />
        <BookingCard.DateTime />
        <BookingCard.Divider />
        <BookingCard.Address />
        <BookingCard.Divider />
        <BookingCard.Participants />
        <BookingCard.Divider />
        <BookingCard.PriceDetails />
        <BookingCard.Total />
        <BookingCard.DepositNote />
      </aside>
    </BookingCard.Provider>
  )
}
