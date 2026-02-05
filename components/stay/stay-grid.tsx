'use client'

import { Stay } from '@/lib/constants/stays'
import StayCard from '@/components/stay/stay-card'

type StayGridProps = {
  stays: Stay[]
  lang: string
  categoryLabels: Record<string, string>
}

export default function StayGrid({ stays, lang, categoryLabels }: StayGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {stays.map(stay => (
        <StayCard
          key={stay.id}
          stay={stay}
          lang={lang}
          categoryLabel={stay.category ? categoryLabels[stay.category] : undefined}
        />
      ))}
    </div>
  )
}
