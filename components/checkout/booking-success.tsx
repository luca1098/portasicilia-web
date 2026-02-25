'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CalendarIcon, CheckCircle2Icon, MapPin, StarIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { Button } from '@/components/ui/button'

import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'

type PriceTier = {
  tierType: string
  baseAmount: number
  quantity: number
  subtotal: number
}

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
  priceTiers: PriceTier[]
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
  depositAmount,
  priceTiers,
}: BookingSuccessProps) {
  const t = useTranslation()
  const { lang } = useParams<{ lang: string }>()

  const avgRating =
    experience.reviews && experience.reviews.length > 0
      ? experience.reviews.reduce((sum, r) => sum + r.rating, 0) / experience.reviews.length
      : null

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString(lang === 'en' ? 'en-GB' : 'it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const participantParts: string[] = []
  if (adults > 0) {
    participantParts.push(interpolate(adults === 1 ? t.checkout_adult : t.checkout_adults, { count: adults }))
  }
  if (children > 0) {
    participantParts.push(
      interpolate(children === 1 ? t.checkout_child : t.checkout_children, { count: children })
    )
  }
  if (infants > 0) {
    participantParts.push(
      interpolate(infants === 1 ? t.checkout_infant : t.checkout_infants, { count: infants })
    )
  }

  const getPriceTierLine = (tier: PriceTier): string => {
    if (tier.tierType === 'PER_EXPERIENCE') {
      return t.checkout_price_per_experience
    }
    if (tier.tierType === 'PER_ASSET') {
      return interpolate(t.checkout_price_per_asset, {
        price: Math.round(tier.baseAmount),
        quantity: tier.quantity,
        asset: experience.assetLabel ?? '',
      })
    }
    const label = (() => {
      switch (tier.tierType) {
        case 'ADULT':
          return interpolate(tier.quantity === 1 ? t.checkout_adult : t.checkout_adults, {
            count: tier.quantity,
          })
        case 'CHILD':
          return interpolate(tier.quantity === 1 ? t.checkout_child : t.checkout_children, {
            count: tier.quantity,
          })
        case 'INFANT':
          return interpolate(tier.quantity === 1 ? t.checkout_infant : t.checkout_infants, {
            count: tier.quantity,
          })
        default:
          return tier.tierType.toLowerCase()
      }
    })()
    return `€ ${Math.round(tier.baseAmount)} x  ${label}`
  }

  const coverUrl = experience.images?.[0]?.url ?? experience.cover

  const depositStr = depositAmount !== null && depositAmount > 0 ? `€ ${Math.round(depositAmount)}` : null
  const depositParts = (() => {
    if (depositStr === null) return null
    const fullText = interpolate(t.checkout_deposit_note, { amount: depositStr })
    return fullText.split(depositStr)
  })()

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
      <div className="mt-8 rounded-xl border bg-background">
        {/* Experience header */}
        <div className="flex gap-4 p-5">
          {coverUrl && (
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
              <Image src={coverUrl} alt={experience.name} fill className="object-cover" sizes="96px" />
            </div>
          )}
          <div className="flex min-w-0 flex-col justify-center">
            <h2 className="text-sm font-semibold leading-snug">{experience.name}</h2>
            {avgRating !== null && (
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                <span>{avgRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        <hr className="border-border" />

        {/* Date and time */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{t.checkout_date_time}</p>
            <p className="text-xs text-muted-foreground">{t.checkout_timezone}</p>
          </div>
          <p className="mt-1 text-sm capitalize text-muted-foreground">{formattedDate}</p>
          <p className="text-sm text-muted-foreground">
            {startTime} - {endTime}
          </p>
        </div>

        <hr className="border-border" />

        {/* Address */}
        <div className="px-5 py-4">
          <p className="text-sm font-medium">{t.checkout_address}</p>
          <div className="mt-1 flex items-start gap-1.5">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              {experience.street}, {experience.city}
            </p>
          </div>
        </div>

        <hr className="border-border" />

        {/* Participants */}
        <div className="px-5 py-4">
          <p className="text-sm font-medium">{t.checkout_participants}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {participantParts.join(t.checkout_participants_separator)}
          </p>
        </div>

        <hr className="border-border" />

        {/* Price details */}
        <div className="space-y-2 px-5 py-4">
          <p className="text-sm font-medium">{t.checkout_price_detail}</p>
          {priceTiers.map(tier => (
            <div key={tier.tierType} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{getPriceTierLine(tier)}</span>
              <span className="text-sm text-muted-foreground">{`€ ${Math.round(tier.subtotal)}`}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <hr className="border-border" />
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm font-bold">{t.checkout_total_eur}</span>
          <span className="text-sm font-bold">{`€ ${Math.round(totalPrice)}`}</span>
        </div>

        {/* Deposit note */}
        {depositStr !== null && depositParts !== null && (
          <>
            <hr className="border-border" />
            <div className="px-5 py-4">
              <p className="text-center text-xs text-muted-foreground">
                {depositParts[0]}
                <span className="font-semibold">{depositStr}</span>
                {depositParts[1]}
              </p>
            </div>
          </>
        )}
      </div>

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
