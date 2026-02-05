import { Stay } from '@/lib/constants/stays'
import StayCard from '@/components/stay/stay-card'

type StayListProps = {
  stays: Stay[]
  lang: string
  categoryLabels: Record<string, string>
  darkBg?: boolean
}

export default function StayList({ stays, lang, categoryLabels, darkBg }: StayListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
      {stays.map(stay => (
        <StayCard
          key={stay.id}
          stay={stay}
          lang={lang}
          categoryLabel={stay.category ? categoryLabels[stay.category] : undefined}
          darkBg={darkBg}
        />
      ))}
    </div>
  )
}
