'use client'

import type { StayCard as StayCardType } from '@/lib/api/stays'
import StayCard from '@/components/stay/stay-card'

type StayGridProps = {
  stays: StayCardType[]
  lang: string
}

export default function StayGrid({ stays, lang }: StayGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {stays.map(stay => (
        <StayCard key={stay.id} stay={stay} lang={lang} />
      ))}
    </div>
  )
}
