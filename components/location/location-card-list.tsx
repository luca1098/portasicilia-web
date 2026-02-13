'use client'

import type { LocalityCard } from '@/lib/api/localities'
import LocationCard from '@/components/location/location-card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

type LocationCardListProps = {
  locations: LocalityCard[]
  lang: string
  darkBg?: boolean
}

export default function LocationCardList({ locations, lang, darkBg }: LocationCardListProps) {
  return (
    <>
      {/* Mobile/Tablet carousel */}
      <div className="lg:hidden">
        <Carousel opts={{ align: 'start', loop: true }}>
          <CarouselContent className="-ml-2">
            {locations.map(location => (
              <CarouselItem key={location.id} className="pl-2 basis-[45%] md:basis-[30%]">
                <LocationCard location={location} lang={lang} darkBg={darkBg} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      {/* Desktop grid */}
      <div className="hidden lg:grid lg:grid-cols-6 gap-4">
        {locations.map(location => (
          <LocationCard key={location.id} location={location} lang={lang} darkBg={darkBg} />
        ))}
      </div>
    </>
  )
}
