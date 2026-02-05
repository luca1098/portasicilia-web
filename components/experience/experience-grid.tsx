'use client'

import { Experience } from '@/lib/constants/experiences'
import ExperienceCard from '@/components/experience/experience-card'

type ExperienceGridProps = {
  experiences: Experience[]
  lang: string
  categoryLabels: Record<string, string>
}

export default function ExperienceGrid({ experiences, lang, categoryLabels }: ExperienceGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {experiences.map(experience => (
        <ExperienceCard
          key={experience.id}
          experience={experience}
          lang={lang}
          categoryLabel={categoryLabels[experience.category] ?? experience.category}
        />
      ))}
    </div>
  )
}
