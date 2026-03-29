import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'
import { buildListingMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/lib/seo/json-ld'
import { experienceSchema, breadcrumbSchema } from '@/lib/seo/schema'
import { SITE_URL } from '@/lib/seo/constants'
import { getExperienceBySlug } from '@/lib/api/experiences'
import { ApiError } from '@/lib/api/fetch-client'
import ExperienceDetailContent from '@/components/experience/detail/experience-detail-content'

type ExperienceDetailPageProps = {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateMetadata({ params }: ExperienceDetailPageProps): Promise<Metadata> {
  const { lang, slug } = await params
  try {
    const [t, experience] = await Promise.all([
      getTranslations(lang as SupportedLocale),
      getExperienceBySlug(slug, lang),
    ])
    return buildListingMetadata(experience, 'experiences', lang, t.seo_experience_suffix)
  } catch {
    return {}
  }
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { lang, slug } = await params
  const t = await getTranslations(lang as SupportedLocale)

  let experience
  try {
    experience = await getExperienceBySlug(slug, lang)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound()
    }
    throw error
  }

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: t.seo_breadcrumb_home, url: `${SITE_URL}/${lang}` },
            { name: t.seo_breadcrumb_experiences, url: `${SITE_URL}/${lang}/experiences` },
            { name: experience.name, url: `${SITE_URL}/${lang}/experiences/${experience.slug}` },
          ]),
          experienceSchema(experience, lang),
        ]}
      />
      <ExperienceDetailContent experience={experience} lang={lang} />
    </>
  )
}
