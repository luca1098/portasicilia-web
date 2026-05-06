'use client'

import LocationCard from '@/components/location/location-card'
import { LocalityCard } from '@/lib/api/localities'

type LocationGridProps = {
  locations: LocalityCard[]
  lang: string
}

export default function LocationGrid({ locations, lang }: LocationGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
      {locations.map(location => (
        <LocationCard key={location.id} location={location} lang={lang} />
      ))}
    </div>
  )
}
