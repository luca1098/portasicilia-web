import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { SupportedLocale } from '@/lib/configs/locales'
import { getExperiences } from '@/lib/api/experiences'
import ExperienceGrid from '@/components/experience/experience-grid'

export default async function ExperiencesPage({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  const { data: experiences } = await getExperiences()

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">{t.experiences_page_title}</h1>
      <ExperienceGrid experiences={experiences} lang={lang} />
    </main>
  )
}
