import type { Metadata } from 'next'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { SupportedLocale } from '@/lib/configs/locales'
import { buildMetadata } from '@/lib/seo/metadata'
import { getExperienceCards } from '@/lib/api/experiences'
import ExperienceCardGrid from '@/components/experience/experience-card-grid'

export async function generateMetadata({ params }: PageParamsProps): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)
  return buildMetadata({
    title: t.seo_experiences_title,
    description: t.seo_experiences_description,
    path: 'experiences',
    locale: lang,
  })
}

export default async function ExperiencesPage({ params }: PageParamsProps) {
  const { lang } = await params
  const [t, { data: experienceCards }] = await Promise.all([
    getTranslations(lang as SupportedLocale),
    getExperienceCards(),
  ])

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">{t.experiences_page_title}</h1>
      <ExperienceCardGrid experiences={experienceCards} lang={lang} />
    </main>
  )
}
