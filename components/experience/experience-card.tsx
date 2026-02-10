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

export default function ExperienceCard({ experience, lang, darkBg }: ExperienceCardProps) {
  const t = useTranslation()
  const price = 0
  const avgRating =
    experience.reviews && experience.reviews.length > 0
      ? experience.reviews.reduce((sum, r) => sum + r.rating, 0) / experience.reviews.length
      : 0

  return (
    <ListingCard
      title={experience.name}
      image={experience.cover ?? ''}
      href={`/${lang}/experiences/${experience.slug}`}
      rating={avgRating}
      priceLabel={price > 0 ? interpolate(t.experience_price, { price: formatCurrency(price) }) : ''}
      darkBg={darkBg}
    />
  )
}
