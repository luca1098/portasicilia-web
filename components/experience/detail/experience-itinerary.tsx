'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslation } from '@/lib/context/translation.context'
import type { ExperienceItinerary as ExperienceItineraryType } from '@/lib/schemas/entities/experience.entity.schema'

const VISIBLE_LIMIT = 4

type ExperienceItineraryProps = {
  title: string
  steps: ExperienceItineraryType[]
}

export default function ExperienceItinerary({ title, steps }: ExperienceItineraryProps) {
  const t = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const visibleSteps = expanded ? steps : steps.slice(0, VISIBLE_LIMIT)
  const hasMore = steps.length > VISIBLE_LIMIT

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="space-y-4">
        {visibleSteps.map(step => (
          <div key={step.id} className="flex gap-4">
            {step.image && (
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                <Image src={step.image} alt={step.title} fill className="object-cover" sizes="80px" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold">{step.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          className="mt-4 text-sm font-semibold underline"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? t.exp_detail_show_less : t.exp_detail_show_all}
        </button>
      )}
    </div>
  )
}
