import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'
import { buildMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/lib/seo/json-ld'
import { touristDestinationSchema, breadcrumbSchema, faqSchema } from '@/lib/seo/schema'
import { SITE_URL } from '@/lib/seo/constants'
import { getLocalityBySlug, getSuggestedLocalities } from '@/lib/api/localities'
import { getExperienceCards } from '@/lib/api/experiences'
import { getStayCards } from '@/lib/api/stays'
import { getArticles } from '@/lib/api/blog'
import { interpolate } from '@/lib/utils/i18n.utils'
import { ApiError } from '@/lib/api/fetch-client'
import LocationDetailHero from '@/components/location/location-detail-hero'
import StayList from '@/components/stay/stay-list'
import LocationTipsSection from '@/components/location/location-poi-section'
import ExperienceCardList from '@/components/experience/experience-card-list'
import RelatedArticlesSection from '@/components/blog/related-articles-section'
import SuggestedLocalities from '@/components/location/suggested-localities'

type LocationDetailPageProps = {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateMetadata({ params }: LocationDetailPageProps): Promise<Metadata> {
  const { lang, slug } = await params
  try {
    const [t, locality] = await Promise.all([
      getTranslations(lang as SupportedLocale),
      getLocalityBySlug(slug, lang),
    ])
    return buildMetadata({
      title: `${locality.name} — ${t.seo_location_suffix}`,
      description: `${locality.name}: ${t.seo_locations_description}`,
      path: `location/${slug}`,
      locale: lang,
      image: locality.cover || undefined,
    })
  } catch {
    return {}
  }
}

export default async function LocationDetailPage({ params }: LocationDetailPageProps) {
  const { lang, slug } = await params
  const t = await getTranslations(lang as SupportedLocale)

  let locality
  try {
    locality = await getLocalityBySlug(slug, lang)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound()
    }
    throw error
  }

  const [{ data: experienceCards }, { data: stayCards }, articlesResult, suggestedLocalities] =
    await Promise.all([
      getExperienceCards({ localityId: locality.id }),
      getStayCards({ localityId: locality.id }),
      getArticles({ localityId: locality.id, limit: 4 }),
      getSuggestedLocalities({ limit: 4, exclude: locality.id, lang }),
    ])

  const tips = locality.tips ?? []
  const jsonLdData: Record<string, unknown>[] = [
    breadcrumbSchema([
      { name: t.seo_breadcrumb_home, url: `${SITE_URL}/${lang}` },
      { name: t.seo_breadcrumb_locations, url: `${SITE_URL}/${lang}/location` },
      { name: locality.name, url: `${SITE_URL}/${lang}/location/${locality.slug}` },
    ]),
    touristDestinationSchema(locality, lang),
  ]
  if (tips.length > 0) {
    jsonLdData.push(faqSchema(tips.map(tip => ({ question: tip.title, answer: tip.description }))))
  }

  return (
    <main className="min-h-screen">
      <JsonLd data={jsonLdData} />
      <LocationDetailHero name={locality.name} cover={locality.cover} />

      {experienceCards.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">
            {interpolate(t.location_detail_experiences_title, { name: locality.name })}
          </h2>
          <ExperienceCardList experiences={experienceCards} lang={lang} />
        </section>
      )}

      {stayCards.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">
            {interpolate(t.location_detail_stays_title, { name: locality.name })}
          </h2>
          <StayList stays={stayCards} lang={lang} />
        </section>
      )}

      <LocationTipsSection
        title={interpolate(t.location_detail_poi_title, { name: locality.name })}
        tips={locality.tips ?? []}
      />

      <RelatedArticlesSection
        articles={articlesResult.data}
        lang={lang}
        title={interpolate(t.location_related_articles_title, { name: locality.name })}
        ctaLabel={t.related_articles_cta}
      />

      <SuggestedLocalities
        title={t.location_detail_suggested_title}
        locations={suggestedLocalities}
        lang={lang}
      />
    </main>
  )
}
