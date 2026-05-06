import type { LocalityCard } from '@/lib/api/localities'
import LocationCardGrid from '@/components/location/location-card-grid'

type SuggestedLocalitiesProps = {
  title: string
  locations: LocalityCard[]
  lang: string
}

export default function SuggestedLocalities({ title, locations, lang }: SuggestedLocalitiesProps) {
  if (locations.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl">{title}</h2>
      <LocationCardGrid locations={locations} lang={lang} />
    </section>
  )
}
