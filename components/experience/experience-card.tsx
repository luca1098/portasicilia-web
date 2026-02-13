'use client'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import { formatCurrency } from '@/core/utils/currency.utils'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import ListingCard from '@/components/shared/listing-card'

type ExperienceCardProps = {
  experience: Experience
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

function getPriceLabel(experience: Experience, t: Record<string, string>): string {
  const priceList = experience.priceLists?.[0]
  const tier = priceList?.tiers?.[0]
  if (!tier) return ''

  const price = formatCurrency(tier.baseAmount, priceList?.currency)
  const mode = priceList?.pricingMode ?? experience.pricingMode

  if (mode === 'PER_PERSON') {
    return interpolate(t.experience_price_per_person, { price })
  }
  if (mode === 'PER_ASSET') {
    return interpolate(t.experience_price_per_asset, {
      price,
      asset: experience.assetLabel ?? '',
    })
  }
  return interpolate(t.experience_price_per_experience, { price })
}

export default function ExperienceCard({ experience, lang, darkBg }: ExperienceCardProps) {
  const t = useTranslation()
  const avgRating =
    experience.reviews && experience.reviews.length > 0
      ? experience.reviews.reduce((sum, r) => sum + r.rating, 0) / experience.reviews.length
      : 0
  const priceLabel = getPriceLabel(experience, t)
  const durationMinutes = experience.timeSlots?.[0]?.durationInMinutes
  const duration = durationMinutes ? formatDuration(durationMinutes) : undefined
  return (
    <ListingCard
      title={experience.name}
      image={experience.cover ?? ''}
      href={`/${lang}/experiences/${experience.slug}`}
      rating={avgRating}
      priceLabel={priceLabel}
      duration={duration}
      darkBg={darkBg}
    />
  )
}
