'use client'

import { ClockIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { formatCurrency } from '@/core/utils/currency.utils'
import { cn } from '@/lib/utils/shadcn.utils'
import type { ExperienceTimeSlot } from '@/lib/schemas/entities/experience.entity.schema'
import type { PricingMode } from '@/lib/schemas/entities/pricing.entity.schema'

type BookingTimeSlotCardProps = {
  slot: ExperienceTimeSlot
  price: number
  pricingMode: PricingMode
  assetLabel?: string | null
  availableSpots: number
  onSelect: (slotId: string) => void
}

export default function BookingTimeSlotCard({
  slot,
  price,
  pricingMode,
  assetLabel,
  availableSpots,
  onSelect,
}: BookingTimeSlotCardProps) {
  const t = useTranslation()

  const hours = Math.floor(slot.durationInMinutes / 60)
  const mins = slot.durationInMinutes % 60
  const durationLabel =
    hours > 0 && mins > 0
      ? `${interpolate(hours === 1 ? t.exp_booking_duration_hours : t.exp_booking_duration_hours_plural, { hours })} ${interpolate(t.exp_booking_duration_minutes, { minutes: mins })}`
      : hours > 0
        ? interpolate(hours === 1 ? t.exp_booking_duration_hours : t.exp_booking_duration_hours_plural, {
            hours,
          })
        : interpolate(t.exp_booking_duration_minutes, { minutes: slot.durationInMinutes })

  const priceLabel =
    pricingMode === 'PER_PERSON'
      ? interpolate(t.exp_booking_per_person, { price: formatCurrency(price) })
      : pricingMode === 'PER_ASSET'
        ? interpolate(t.exp_booking_per_asset, { price: formatCurrency(price), asset: assetLabel ?? '' })
        : interpolate(t.exp_booking_per_experience, { price: formatCurrency(price) })

  const spotsLabel =
    availableSpots === 1
      ? interpolate(t.exp_booking_available_spot, { count: availableSpots })
      : interpolate(t.exp_booking_available_spots, { count: availableSpots })

  const spotsColor = availableSpots <= 3 ? 'text-amber-600' : 'text-teal-600'

  return (
    <button
      type="button"
      onClick={() => onSelect(slot.id)}
      className={cn(
        'w-full rounded-xl border border-border p-4',
        'flex items-center justify-between gap-4',
        'text-left transition-colors',
        'hover:border-teal-600/40 hover:bg-teal-50/30'
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {slot.startTime} - {slot.endTime}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{priceLabel}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
          <ClockIcon className="size-3" />
          {durationLabel}
        </p>
        <p className={cn('mt-0.5 text-xs font-medium', spotsColor)}>{spotsLabel}</p>
      </div>
    </button>
  )
}
