'use client'

import { memo, useCallback, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslation } from '@/lib/context/translation.context'
import { cn } from '@/lib/utils/shadcn.utils'
import { Button } from '@/components/ui/button'
import BookingTimeSlotCard from '@/components/experience/detail/booking-time-slot-card'
import { formatDayHeader } from './booking.utils'
import type { AvailableDateSlots } from '@/lib/api/experiences'
import type { PricingMode } from '@/lib/schemas/entities/pricing.entity.schema'

const MAX_VISIBLE_SLOTS = 3

type BookingDaySlotGroupProps = {
  entry: AvailableDateSlots
  pricingMode: PricingMode
  assetLabel?: string | null
  onSlotSelect: (slotId: string, slotDate: string) => void
}

function BookingDaySlotGroup({ entry, pricingMode, assetLabel, onSlotSelect }: BookingDaySlotGroupProps) {
  const t = useTranslation()
  const { lang } = useParams<{ lang: string }>()

  const [isExpanded, setIsExpanded] = useState(false)

  const hasMore = entry.slots.length > MAX_VISIBLE_SLOTS
  const visibleSlots = isExpanded ? entry.slots : entry.slots.slice(0, MAX_VISIBLE_SLOTS)

  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  return (
    <div className="mb-5">
      <h4 className="mb-2.5 text-sm font-semibold">{formatDayHeader(entry.date, lang)}</h4>
      {entry.slots.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t.exp_booking_no_available_slots}</p>
      ) : (
        <>
          <div className="space-y-2">
            {visibleSlots.map(slot => (
              <BookingTimeSlotCard
                key={slot.id}
                slot={slot}
                price={slot.startingPrice ?? 0}
                pricingMode={pricingMode}
                assetLabel={assetLabel}
                availableSpots={slot.remainingCapacity}
                onSelect={(slotId: string) => onSlotSelect(slotId, entry.date)}
              />
            ))}
          </div>
          {hasMore ? (
            <Button type="button" variant="link" size={'sm'} onClick={handleToggle} className={cn('px-0')}>
              {isExpanded ? t.exp_booking_show_less_slots : t.exp_booking_show_all_slots}
            </Button>
          ) : null}
        </>
      )}
    </div>
  )
}

export default memo(BookingDaySlotGroup)
