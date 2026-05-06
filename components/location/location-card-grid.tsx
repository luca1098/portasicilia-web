'use client'

import type { LocalityCard } from '@/lib/api/localities'
import LocationCard from '@/components/location/location-card'

type LocationCardGridProps = {
  locations: LocalityCard[]
  lang: string
}

export default function LocationCardGrid({ locations, lang }: LocationCardGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
      {locations.map(location => (
        <LocationCard key={location.id} location={location} lang={lang} />
      ))}
    </div>
  )
}
