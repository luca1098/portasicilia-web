'use client'

import { Stay } from '@/lib/constants/stays'
import StayCard from '@/components/stay/stay-card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

type StayListProps = {
  stays: Stay[]
  lang: string
  categoryLabels: Record<string, string>
  darkBg?: boolean
}

export default function StayList({ stays, lang, categoryLabels, darkBg = false }: StayListProps) {
  return (
    <>
      {/* Mobile/Tablet carousel */}
      <div className="lg:hidden">
        <Carousel opts={{ align: 'start', loop: false }}>
          <CarouselContent className="-ml-2">
            {stays.map(stay => (
              <CarouselItem key={stay.id} className="pl-2 basis-[45%] md:basis-[30%]">
                <StayCard
                  stay={stay}
                  lang={lang}
                  categoryLabel={stay.category ? categoryLabels[stay.category] : undefined}
                  darkBg={darkBg}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      {/* Desktop grid */}
      <div className="hidden lg:grid lg:grid-cols-6 gap-4">
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
    </>
  )
}
