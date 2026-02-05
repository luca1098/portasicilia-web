'use client'
import { Stay } from '@/lib/constants/stays'
import { formatCurrency } from '@/core/utils/currency.utils'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import ListingCard from '@/components/shared/listing-card'

type StayCardProps = {
  stay: Stay
  lang: string
  categoryLabel?: string
  darkBg?: boolean
}

export default function StayCard({ stay, lang, categoryLabel, darkBg }: StayCardProps) {
  const t = useTranslation()
  return (
    <ListingCard
      title={stay.title}
      image={stay.image}
      href={`/${lang}/stays/${stay.id}`}
      rating={stay.rating}
      priceLabel={interpolate(t.stay_price, { price: formatCurrency(stay.price) })}
      categoryLabel={categoryLabel}
      darkBg={darkBg}
    />
  )
}
