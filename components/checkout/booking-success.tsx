'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CalendarIcon, CheckCircle2Icon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { buildParticipantSummary } from '@/lib/utils/checkout.utils'
import { parseDate } from '@/lib/utils/date.utils'
import { Button } from '@/components/ui/button'
import { BookingCard } from './booking-card'

import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import type { BookingPriceTier } from '@/lib/utils/checkout.utils'

type BookingSuccessProps = {
  listingType: 'EXPERIENCE' | 'STAY'
  experience: Experience
  stay?: Stay
  date: string
  dateTo?: string
  nights?: number
  startTime: string
  endTime: string
  adults: number
  children: number
  infants: number
  totalPrice: number
  depositAmount: number | null
  priceTiers: BookingPriceTier[]
}

function generateExperienceIcs(
  experience: Experience,
  date: string,
  startTime: string,
  endTime: string
): void {
  const formatDateTime = (d: string, t: string) => {
    const [h, m] = t.split(':')
    return `${d.replace(/-/g, '')}T${h}${m}00`
  }

  const dtStart = formatDateTime(date, startTime)
  const dtEnd = formatDateTime(date, endTime)
  const location = `${experience.street}, ${experience.city}`

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PortaSicilia//Booking//IT',
    'BEGIN:VEVENT',
    `DTSTART;TZID=Europe/Rome:${dtStart}`,
    `DTEND;TZID=Europe/Rome:${dtEnd}`,
    `SUMMARY:${experience.name}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  downloadIcs(ics, `${experience.slug}-booking.ics`)
}

function generateStayIcs(stay: Stay, date: string, dateTo: string): void {
  const checkIn = stay.checkInTime ?? stay.stayDetail?.checkInTime ?? '15:00'
  const checkOut = stay.checkOutTime ?? stay.stayDetail?.checkOutTime ?? '10:00'

  const formatDateTime = (d: string, t: string) => {
    const [h, m] = t.split(':')
    return `${d.replace(/-/g, '')}T${h}${m}00`
  }

  const dtStart = formatDateTime(date, checkIn)
  const dtEnd = formatDateTime(dateTo, checkOut)
  const location = `${stay.street}, ${stay.city}`

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PortaSicilia//Booking//IT',
    'BEGIN:VEVENT',
    `DTSTART;TZID=Europe/Rome:${dtStart}`,
    `DTEND;TZID=Europe/Rome:${dtEnd}`,
    `SUMMARY:${stay.name}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  downloadIcs(ics, `${stay.slug}-booking.ics`)
}

function downloadIcs(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function BookingSuccess({
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
  priceTiers,
  depositAmount,
}: BookingSuccessProps) {
  const t = useTranslation() as Record<string, string>
  const { lang } = useParams<{ lang: string }>()

  const isStay = listingType === 'STAY'
  const listing = isStay ? stay : experience

  const formatOpts: Intl.DateTimeFormatOptions = isStay
    ? { day: 'numeric', month: 'long', year: 'numeric' }
    : { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }

  const locale = lang === 'en' ? 'en-GB' : 'it-IT'
  const formattedDate = parseDate(date).toLocaleDateString(locale, formatOpts)
  const formattedDateTo = dateTo ? parseDate(dateTo).toLocaleDateString(locale, formatOpts) : undefined

  const coverUrl = listing?.images?.[0]?.url ?? listing?.cover ?? null
  const guestSummary = isStay
    ? buildParticipantSummary(adults, children, infants, t, t.checkout_participants_separator)
    : undefined

  const handleAddToCalendar = () => {
    if (isStay && stay && dateTo) {
      generateStayIcs(stay, date, dateTo)
    } else if (experience) {
      generateExperienceIcs(experience, date, startTime, endTime)
    }
  }

  const title = isStay ? t.booking_success_stay_title : t.booking_success_title

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      {/* Animated checkmark */}
      <div className="flex justify-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2Icon className="size-9 text-emerald-600" aria-hidden="true" />
        </div>
      </div>

      {/* Title */}
      <h1 className="mt-6 text-center text-xl font-bold leading-snug">{title}</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">{t.booking_success_subtitle}</p>

      {/* Booking recap card */}
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
        <div className="mt-8 rounded-xl border bg-background">
          <BookingCard.Header variant="large" />
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
              <BookingCard.AddressWithIcon />
              <BookingCard.Divider />
              <BookingCard.Participants />
            </>
          )}
          <BookingCard.Divider />
          <BookingCard.PriceDetails />
          <BookingCard.Total />
          <BookingCard.DepositPaid />
        </div>
      </BookingCard.Provider>

      {/* Action buttons */}
      <div className="mt-8 space-y-3">
        <Button variant="outline" className="h-11 w-full gap-2" onClick={handleAddToCalendar}>
          <CalendarIcon className="size-4" aria-hidden="true" />
          {t.booking_success_add_calendar}
        </Button>

        <Button className="h-11 w-full" asChild>
          <Link href={`/${lang}`}>{t.booking_success_back_home}</Link>
        </Button>
      </div>
    </div>
  )
}
