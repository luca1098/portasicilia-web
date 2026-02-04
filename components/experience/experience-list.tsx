import { Experience } from '@/lib/constants/experiences'
import ExperienceCard from '@/components/experience/experience-card'

type ExperienceListProps = {
  experiences: Experience[]
  lang: string
  categoryLabels: Record<string, string>
}

export default function ExperienceList({ experiences, lang, categoryLabels }: ExperienceListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
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
