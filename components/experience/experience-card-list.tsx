'use client'

import type { ExperienceCard } from '@/lib/api/experiences'
import ExperienceCardItem from '@/components/experience/experience-card-item'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

type ExperienceCardListProps = {
  experiences: ExperienceCard[]
  lang: string
  darkBg?: boolean
}

export default function ExperienceCardList({ experiences, lang, darkBg = false }: ExperienceCardListProps) {
  return (
    <>
      {/* Mobile/Tablet carousel */}
      <div className="lg:hidden">
        <Carousel opts={{ align: 'start', loop: false }}>
          <CarouselContent className="-ml-2">
            {experiences.map(experience => (
              <CarouselItem key={experience.id} className="pl-2 basis-[45%] md:basis-[30%]">
                <ExperienceCardItem experience={experience} lang={lang} darkBg={darkBg} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      {/* Desktop grid */}
      <div className="hidden lg:grid lg:grid-cols-6 gap-4">
        {experiences.map(experience => (
          <ExperienceCardItem key={experience.id} experience={experience} lang={lang} darkBg={darkBg} />
        ))}
      </div>
    </>
  )
}
