import { notFound } from 'next/navigation'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'
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

export default async function LocationDetailPage({ params }: LocationDetailPageProps) {
  const { lang, slug } = await params
  const t = await getTranslations(lang as SupportedLocale)

  let locality
  try {
    locality = await getLocalityBySlug(slug)
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
      getSuggestedLocalities({ limit: 4, exclude: locality.id }),
    ])

  return (
    <main className="min-h-screen">
      <LocationDetailHero name={locality.name} cover={locality.cover} />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="mb-6 text-2xl font-bold md:text-3xl">
          {interpolate(t.location_detail_experiences_title, { name: locality.name })}
        </h2>
        <ExperienceCardList experiences={experienceCards} lang={lang} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="mb-6 text-2xl font-bold md:text-3xl">
          {interpolate(t.location_detail_stays_title, { name: locality.name })}
        </h2>
        <StayList stays={stayCards} lang={lang} />
      </section>

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
