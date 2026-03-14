'use client'

import Image from 'next/image'
import { StarIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { formatCurrency } from '@/core/utils/currency.utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'

type StayBookingCardProps = {
  stay: Stay
}

export default function StayBookingCard({ stay }: StayBookingCardProps) {
  const t = useTranslation()

  const reviews = stay.reviews ?? []
  const avgRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null

  const tiers = stay.priceLists?.[0]?.tiers
  const nightlyPrice = tiers && tiers.length > 0 ? Math.min(...tiers.map(tier => tier.baseAmount)) : 0

  const coverUrl = stay.images?.[0]?.url ?? stay.cover

  return (
    <div className="rounded-xl border bg-background shadow-sm">
      {/* Header with name and rating */}
      <div className="flex items-center gap-3 border-b p-4">
        {coverUrl && (
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
            <Image src={coverUrl} alt={stay.name} fill className="object-cover" sizes="48px" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{stay.name}</p>
        </div>
        {avgRating && (
          <div className="flex items-center gap-1 text-sm">
            <StarIcon className="size-3.5 fill-foreground" />
            <span className="font-semibold">{avgRating}</span>
          </div>
        )}
      </div>

      {/* Date inputs */}
      <div className="border-b p-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">{t.stay_detail_check_in}</label>
            <Input type="date" className="h-9 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">{t.stay_detail_check_out}</label>
            <Input type="date" className="h-9 text-sm" />
          </div>
        </div>
        <div className="mt-2">
          <label className="mb-1 block text-xs text-muted-foreground">{t.stay_detail_guests}</label>
          <Input
            type="number"
            min={1}
            max={stay.stayDetail?.maxPeople ?? stay.maxPeople ?? 10}
            defaultValue={1}
            className="h-9 text-sm"
          />
        </div>
      </div>

      {/* Price + Book button */}
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">
              {interpolate(t.stay_detail_price_per_night, { price: formatCurrency(nightlyPrice) })}
            </p>
            <p className="text-xs font-semibold text-primary">{t.stay_detail_free_cancellation}</p>
          </div>
          <Button size="lg">{t.stay_detail_book}</Button>
        </div>
      </div>
    </div>
  )
}
