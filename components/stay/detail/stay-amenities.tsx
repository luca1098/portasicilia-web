'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/context/translation.context'
import { STAY_AMENITIES } from '@/lib/constants/stay-amenities'

type StayAmenitiesProps = {
  amenities: string[]
}

const VISIBLE_LIMIT = 8

export default function StayAmenities({ amenities }: StayAmenitiesProps) {
  const t = useTranslation()
  const [showAll, setShowAll] = useState(false)

  const matchedAmenities = amenities
    .map(a => STAY_AMENITIES.find(config => config.value === a))
    .filter(Boolean) as (typeof STAY_AMENITIES)[number][]

  const visibleAmenities = showAll ? matchedAmenities : matchedAmenities.slice(0, VISIBLE_LIMIT)

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">{t.stay_detail_whats_included}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {visibleAmenities.map(amenity => (
          <div key={amenity.value} className="flex items-center gap-3">
            <amenity.icon className="size-5 text-muted-foreground" />
            <span className="text-sm">{t[amenity.labelKey as keyof typeof t]}</span>
          </div>
        ))}
      </div>
      {matchedAmenities.length > VISIBLE_LIMIT && (
        <button
          type="button"
          className="mt-4 text-sm font-semibold text-primary underline"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? t.stay_detail_show_less : t.stay_detail_show_more}
        </button>
      )}
    </div>
  )
}
