'use client'

import { Location } from '@/lib/constants/locations'
import LocationCard from '@/components/location/location-card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

type LocationListProps = {
  locations: Location[]
  lang: string
  subtitle: string
  darkBg?: boolean
}

export default function LocationList({ locations, lang, subtitle, darkBg }: LocationListProps) {
  return (
    <>
      {/* Mobile/Tablet carousel */}
      <div className="lg:hidden">
        <Carousel opts={{ align: 'start', loop: true }}>
          <CarouselContent className="-ml-2">
            {locations.map(location => (
              <CarouselItem key={location.id} className="pl-2 basis-[45%] md:basis-[30%]">
                <LocationCard location={location} lang={lang} subtitle={subtitle} darkBg={darkBg} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      {/* Desktop grid */}
      <div className="hidden lg:grid lg:grid-cols-6 gap-4">
        {locations.map(location => (
          <LocationCard
            key={location.id}
            location={location}
            lang={lang}
            subtitle={subtitle}
            darkBg={darkBg}
          />
        ))}
      </div>
    </>
  )
}
