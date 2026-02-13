'use client'

import type { ExperienceCard } from '@/lib/api/experiences'
import { formatCurrency } from '@/core/utils/currency.utils'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import ListingCard from '@/components/shared/listing-card'

type ExperienceCardItemProps = {
  experience: ExperienceCard
  lang: string
  darkBg?: boolean
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0 && mins > 0) return `${hours}h ${mins}min`
  if (hours > 0) return `${hours}h`
  return `${mins} min`
}

export default function ExperienceCardItem({ experience, lang, darkBg }: ExperienceCardItemProps) {
  const t = useTranslation()

  const priceLabel = experience.price
    ? (() => {
        const price = formatCurrency(experience.price)
        if (experience.pricingMode === 'PER_PERSON') {
          return interpolate(t.experience_price_per_person, { price })
        }
        if (experience.pricingMode === 'PER_ASSET') {
          return interpolate(t.experience_price_per_asset, { price, asset: experience.assetLabel ?? '' })
        }
        return interpolate(t.experience_price_per_experience, { price })
      })()
    : ''

  const duration = experience.durationInMinutes ? formatDuration(experience.durationInMinutes) : undefined

  return (
    <ListingCard
      title={experience.name}
      image={experience.cover ?? ''}
      href={`/${lang}/experiences/${experience.slug}`}
      rating={experience.avgRating ?? 0}
      reviewCount={experience.reviewCount}
      priceLabel={priceLabel}
      duration={duration}
      darkBg={darkBg}
    />
  )
}
