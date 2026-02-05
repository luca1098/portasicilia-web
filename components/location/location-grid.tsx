'use client'

import { Location } from '@/lib/constants/locations'
import LocationCard from '@/components/location/location-card'

type LocationGridProps = {
  locations: Location[]
  lang: string
  subtitle: string
}

export default function LocationGrid({ locations, lang, subtitle }: LocationGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {locations.map(location => (
        <LocationCard key={location.id} location={location} lang={lang} subtitle={subtitle} />
      ))}
    </div>
  )
}
