'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CalendarIcon, CheckCircle2Icon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { parseDate } from '@/lib/utils/date.utils'
import { Button } from '@/components/ui/button'
import { BookingCard } from './booking-card'

import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import type { BookingPriceTier } from '@/lib/utils/checkout.utils'

type BookingSuccessProps = {
  experience: Experience
  date: string
  startTime: string
  endTime: string
  adults: number
  children: number
  infants: number
  totalPrice: number
  depositAmount: number | null
  priceTiers: BookingPriceTier[]
}

function generateIcsFile(experience: Experience, date: string, startTime: string, endTime: string): void {
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

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${experience.slug}-booking.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function BookingSuccess({
  experience,
  date,
  startTime,
  endTime,
  adults,
  children,
  infants,
  totalPrice,
  priceTiers,
  depositAmount,
}: BookingSuccessProps) {
  const t = useTranslation()
  const { lang } = useParams<{ lang: string }>()

  const formattedDate = parseDate(date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const coverUrl = experience.images?.[0]?.url ?? experience.cover

  const handleAddToCalendar = () => {
    generateIcsFile(experience, date, startTime, endTime)
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      {/* Animated checkmark */}
      <div className="flex justify-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2Icon className="size-9 text-emerald-600" aria-hidden="true" />
        </div>
      </div>

      {/* Title */}
      <h1 className="mt-6 text-center text-xl font-bold leading-snug">{t.booking_success_title}</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">{t.booking_success_subtitle}</p>

      {/* Booking recap card */}
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
        <div className="mt-8 rounded-xl border bg-background">
          <BookingCard.Header variant="large" />
          <BookingCard.Divider />
          <BookingCard.DateTime />
          <BookingCard.Divider />
          <BookingCard.AddressWithIcon />
          <BookingCard.Divider />
          <BookingCard.Participants />
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
