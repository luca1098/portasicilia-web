'use client'

import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import ExperienceCard from '@/components/experience/experience-card'

type ExperienceGridProps = {
  experiences: Experience[]
  lang: string
}

export default function ExperienceGrid({ experiences, lang }: ExperienceGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {experiences.map(experience => (
        <ExperienceCard key={experience.id} experience={experience} lang={lang} />
      ))}
    </div>
  )
}
