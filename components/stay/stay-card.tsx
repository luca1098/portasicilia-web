'use client'

import type { StayCard as StayCardType } from '@/lib/api/stays'
import { formatCurrency } from '@/core/utils/currency.utils'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import ListingCard from '@/components/shared/listing-card'

type StayCardProps = {
  stay: StayCardType
  lang: string
  darkBg?: boolean
}

export default function StayCard({ stay, lang, darkBg }: StayCardProps) {
  const t = useTranslation()

  const priceLabel = stay.nightlyPrice
    ? interpolate(t.stay_price, { price: formatCurrency(stay.nightlyPrice) })
    : ''

  return (
    <ListingCard
      title={stay.name}
      image={stay.cover ?? ''}
      href={`/${lang}/stays/${stay.slug}`}
      rating={stay.avgRating ?? 0}
      reviewCount={stay.reviewCount}
      priceLabel={priceLabel}
      darkBg={darkBg}
    />
  )
}
