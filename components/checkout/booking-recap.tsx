'use client'

import Image from 'next/image'
import { StarIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import useCheckoutStore from '@/core/store/checkout.store'
import type { PriceTier } from '@/core/store/checkout.store'

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

  const avgRating =
    experience.reviews && experience.reviews.length > 0
      ? experience.reviews.reduce((sum, r) => sum + r.rating, 0) / experience.reviews.length
      : null

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

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

  return (
    <aside className="rounded-xl border bg-background" aria-label={t.checkout_booking_summary}>
      {/* Experience header */}
      <div className="flex gap-4 p-5">
        {coverUrl && (
          <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
            <Image src={coverUrl} alt={experience.name} fill className="object-cover" sizes="14px" />
          </div>
        )}
        <div className="flex min-w-0 flex-col justify-center">
          <h3 className="text-sm font-semibold leading-snug">{experience.name}</h3>
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
        <p className="mt-1 text-sm text-muted-foreground">
          {experience.street}, {experience.city}
        </p>
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
      {totalPrice !== null && (
        <>
          <hr className="border-border" />
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm font-bold">{t.checkout_total_eur}</span>
            <span className="text-sm font-bold">{`€ ${Math.round(totalPrice)}`}</span>
          </div>
        </>
      )}

      {/* Deposit and remaining breakdown */}
      {depositStr !== null && totalPrice !== null && depositAmount !== null && depositAmount > 0 && (
        <>
          <hr className="border-border" />
          <div className="space-y-3 px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">{t.checkout_deposit_label}</span>
              <span className="text-sm font-semibold text-primary">{depositStr}</span>
            </div>
            {totalPrice - depositAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{t.checkout_remaining_on_site}</span>
                <span className="text-xs text-muted-foreground">
                  {`€ ${Math.round(totalPrice - depositAmount)}`}
                </span>
              </div>
            )}
            <p className="text-center text-xs text-muted-foreground">
              {depositParts?.[0]}
              <span className="font-semibold">{depositStr}</span>
              {depositParts?.[1]}
            </p>
          </div>
        </>
      )}
    </aside>
  )
}
