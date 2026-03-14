'use client'

import type { StayCard as StayCardType } from '@/lib/api/stays'
import StayCard from '@/components/stay/stay-card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

type StayListProps = {
  stays: StayCardType[]
  lang: string
  darkBg?: boolean
}

export default function StayList({ stays, lang, darkBg = false }: StayListProps) {
  return (
    <>
      {/* Mobile/Tablet carousel */}
      <div className="lg:hidden">
        <Carousel opts={{ align: 'start', loop: false }}>
          <CarouselContent className="-ml-2">
            {stays.map(stay => (
              <CarouselItem key={stay.id} className="pl-2 basis-[45%] md:basis-[30%]">
                <StayCard stay={stay} lang={lang} darkBg={darkBg} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      {/* Desktop grid */}
      <div className="hidden lg:grid lg:grid-cols-6 gap-4">
        {stays.map(stay => (
          <StayCard key={stay.id} stay={stay} lang={lang} darkBg={darkBg} />
        ))}
      </div>
    </>
  )
}
