'use client'

import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import ExperienceCard from '@/components/experience/experience-card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

type ExperienceListProps = {
  experiences: Experience[]
  lang: string
  darkBg?: boolean
}

export default function ExperienceList({ experiences, lang, darkBg = false }: ExperienceListProps) {
  return (
    <>
      {/* Mobile/Tablet carousel */}
      <div className="lg:hidden">
        <Carousel opts={{ align: 'start', loop: false }}>
          <CarouselContent className="-ml-2">
            {experiences.map(experience => (
              <CarouselItem key={experience.id} className="pl-2 basis-[45%] md:basis-[30%]">
                <ExperienceCard experience={experience} lang={lang} darkBg={darkBg} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      {/* Desktop grid */}
      <div className="hidden lg:grid lg:grid-cols-6 gap-4">
        {experiences.map(experience => (
          <ExperienceCard key={experience.id} experience={experience} lang={lang} darkBg={darkBg} />
        ))}
      </div>
    </>
  )
}
