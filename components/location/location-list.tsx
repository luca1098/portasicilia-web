import { Location } from '@/lib/constants/locations'
import LocationCard from '@/components/location/location-card'

type LocationListProps = {
  locations: Location[]
  lang: string
  subtitle: string
}

export default function LocationList({ locations, lang, subtitle }: LocationListProps) {
  return (
    <div className="grid grid-cols-6 gap-4 overflow-x-auto pb-4">
      {locations.map(location => (
        <LocationCard key={location.id} location={location} lang={lang} subtitle={subtitle} />
      ))}
    </div>
  )
}
