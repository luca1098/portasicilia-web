'use client'

import { useState } from 'react'
import { StarIcon, CheckIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { formatCurrency } from '@/core/utils/currency.utils'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import { Button } from '@/components/ui/button'
import ParticipantCounter from '@/components/experience/detail/participant-counter'

type ExperienceBookingCardProps = {
  experience: Experience
}

export default function ExperienceBookingCard({ experience }: ExperienceBookingCardProps) {
  const t = useTranslation()
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)

  const lowestPrice = experience.timeSlots
    ?.flatMap(slot => slot.prices ?? [])
    .reduce((min, p) => (p.price < min ? p.price : min), Infinity)
  const price = lowestPrice && lowestPrice !== Infinity ? lowestPrice : 0
  const avgRating =
    experience.reviews && experience.reviews.length > 0
      ? experience.reviews.reduce((sum, r) => sum + r.rating, 0) / experience.reviews.length
      : 0

  return (
    <div className="rounded-2xl border bg-background p-6 shadow-lg">
      {/* Header */}
      <div className="mb-4">
        <p className="text-sm font-semibold">{experience.name}</p>
        {avgRating > 0 && (
          <div className="mt-1 flex items-center gap-1">
            <StarIcon className="size-3 fill-foreground" />
            <span className="text-xs font-medium">{avgRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Separator */}
      <hr className="mb-4 border-border" />

      {/* Participants */}
      <h3 className="mb-1 text-sm font-semibold">{t.exp_detail_participants}</h3>
      <div className="divide-y">
        <ParticipantCounter
          label={t.exp_detail_adults}
          ageRange={t.exp_detail_adults_age}
          count={adults}
          min={1}
          onChange={setAdults}
        />
        <ParticipantCounter
          label={t.exp_detail_children}
          ageRange={t.exp_detail_children_age}
          count={children}
          onChange={setChildren}
        />
        <ParticipantCounter
          label={t.exp_detail_infants}
          ageRange={t.exp_detail_infants_age}
          count={infants}
          onChange={setInfants}
        />
      </div>

      {/* Price */}
      {price > 0 && (
        <div className="mt-4">
          <p className="text-lg font-bold">
            {interpolate(t.exp_detail_price_per_person, { price: formatCurrency(price) })}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckIcon className="size-3" />
            {t.exp_detail_free_cancellation}
          </p>
        </div>
      )}

      {/* CTA */}
      <Button className="mt-4 w-full" size="lg" onClick={() => null}>
        {t.exp_detail_choose_date}
      </Button>

      {/* Included items */}
      {experience.included.length > 0 && (
        <ul className="mt-4 space-y-2">
          {experience.included.map(item => (
            <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
              <CheckIcon className="mt-0.5 size-3 shrink-0" />
              {t[item as keyof typeof t] ?? item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
