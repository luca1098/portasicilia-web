import { getExperienceCards } from '@/lib/api/experiences'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'
import ExperienceCardItem from '@/components/experience/experience-card-item'

type ExperienceSuggestionsProps = {
  experienceId: string
  categoryId: string
  lang: string
}

export default async function ExperienceSuggestions({
  experienceId,
  categoryId,
  lang,
}: ExperienceSuggestionsProps) {
  const t = await getTranslations(lang as SupportedLocale)

  let suggestions
  try {
    const result = await getExperienceCards({
      categoryId,
      excludeId: experienceId,
      limit: 4,
    })
    suggestions = result.data
  } catch {
    return null
  }

  if (!suggestions.length) return null

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 md:px-8">
      <h2 className="mb-6 text-xl font-semibold md:text-2xl">{t.experience_detail_suggestions_title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {suggestions.map(exp => (
          <ExperienceCardItem key={exp.id} experience={exp} lang={lang} />
        ))}
      </div>
    </section>
  )
}
