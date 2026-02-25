'use client'

import Image from 'next/image'
import { StarIcon, CalendarIcon, MapPin, UsersIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { formatCurrency } from '@/core/utils/currency.utils'

import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'

type BookingRecapProps = {
  experience: Experience
  date: string
  startTime: string
  endTime: string
  adults: number
  children: number
  infants: number
  totalPrice: number | null
  depositAmount: number | null
}

export default function BookingRecap({
  experience,
  date,
  startTime,
  endTime,
  adults,
  children,
  infants,
  totalPrice,
  depositAmount,
}: BookingRecapProps) {
  const t = useTranslation()

  const avgRating =
    experience.reviews && experience.reviews.length > 0
      ? experience.reviews.reduce((sum, r) => sum + r.rating, 0) / experience.reviews.length
      : null

  const formattedDate = (() => {
    const d = new Date(date + 'T00:00:00')
    return d.toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  })()

  const participantParts: string[] = []
  if (adults > 0) {
    participantParts.push(
      interpolate(adults === 1 ? t.checkout_adult : t.checkout_adults, {
        count: adults,
      })
    )
  }
  if (children > 0) {
    participantParts.push(
      interpolate(children === 1 ? t.checkout_child : t.checkout_children, {
        count: children,
      })
    )
  }
  if (infants > 0) {
    participantParts.push(
      interpolate(infants === 1 ? t.checkout_infant : t.checkout_infants, {
        count: infants,
      })
    )
  }

  const coverUrl = experience.images?.[0]?.url ?? experience.cover

  return (
    <aside className="rounded-xl border bg-background" aria-label={t.checkout_booking_summary}>
      {/* Experience header */}
      <div className="flex gap-4 p-5">
        {coverUrl && (
          <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
            <Image src={coverUrl} alt={experience.name} fill className="object-cover" sizes="96px" />
          </div>
        )}
        <div className="flex min-w-0 flex-col justify-center">
          <h3 className="text-sm font-semibold leading-snug">{experience.name}</h3>
          {avgRating !== null && (
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
              <span>{avgRating.toFixed(1)}</span>
              <span>({experience.reviews?.length})</span>
            </div>
          )}
        </div>
      </div>

      <hr className="border-border" />

      {/* Date and time */}
      <div className="flex items-start gap-3 px-5 py-4">
        <CalendarIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium">{t.checkout_date_time}</p>
          <p className="text-sm capitalize text-muted-foreground">{formattedDate}</p>
          <p className="text-sm text-muted-foreground">
            {startTime} - {endTime}
          </p>
        </div>
      </div>

      <hr className="border-border" />

      {/* Address */}
      <div className="flex items-start gap-3 px-5 py-4">
        <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium">{t.checkout_address}</p>
          <p className="text-sm text-muted-foreground">
            {experience.street}, {experience.city}
          </p>
        </div>
      </div>

      <hr className="border-border" />

      {/* Participants */}
      <div className="flex items-start gap-3 px-5 py-4">
        <UsersIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium">{t.checkout_participants}</p>
          <p className="text-sm text-muted-foreground">{participantParts.join(', ')}</p>
        </div>
      </div>

      <hr className="border-border" />

      {/* Price details */}
      <div className="space-y-2 px-5 py-4">
        <p className="text-sm font-medium">{t.checkout_price_detail}</p>
        {totalPrice !== null && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t.checkout_total}</span>
            <span className="text-base font-bold">{formatCurrency(totalPrice)}</span>
          </div>
        )}
      </div>

      {/* Deposit note */}
      {depositAmount !== null && depositAmount > 0 && (
        <>
          <hr className="border-border" />
          <div className="px-5 py-4">
            <p className="text-xs text-muted-foreground">
              {interpolate(t.checkout_deposit_note, {
                amount: formatCurrency(depositAmount),
              })}
            </p>
          </div>
        </>
      )}
    </aside>
  )
}
