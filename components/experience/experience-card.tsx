'use client'
import { Experience } from '@/lib/constants/experiences'
import { formatCurrency } from '@/core/utils/currency.utils'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import ListingCard from '@/components/shared/listing-card'

type ExperienceCardProps = {
  experience: Experience
  lang: string
  categoryLabel: string
}

export default function ExperienceCard({ experience, lang, categoryLabel }: ExperienceCardProps) {
  const t = useTranslation()
  return (
    <ListingCard
      title={experience.title}
      image={experience.image}
      href={`/${lang}/experiences/${experience.id}`}
      rating={experience.rating}
      priceLabel={interpolate(t.experience_price, { price: formatCurrency(experience.price) })}
      categoryLabel={categoryLabel}
      duration={experience.duration}
    />
  )
}
