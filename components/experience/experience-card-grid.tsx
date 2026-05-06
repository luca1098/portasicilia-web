'use client'

import type { ExperienceCard } from '@/lib/api/experiences'
import ExperienceCardItem from '@/components/experience/experience-card-item'

type ExperienceCardGridProps = {
  experiences: ExperienceCard[]
  lang: string
}

export default function ExperienceCardGrid({ experiences, lang }: ExperienceCardGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {experiences.map(experience => (
        <ExperienceCardItem key={experience.id} experience={experience} lang={lang} />
      ))}
    </div>
  )
}
