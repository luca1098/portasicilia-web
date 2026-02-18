import { notFound } from 'next/navigation'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'
import { getLocalityBySlug } from '@/lib/api/localities'
import { getExperienceCards } from '@/lib/api/experiences'
import { interpolate } from '@/lib/utils/i18n.utils'
import { mockStays } from '@/lib/constants/stays'
import { ApiError } from '@/lib/api/fetch-client'
import LocationDetailHero from '@/components/location/location-detail-hero'
import StayList from '@/components/stay/stay-list'
import LocationTipsSection from '@/components/location/location-poi-section'
import ExperienceCardList from '@/components/experience/experience-card-list'

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

  const { data: experienceCards } = await getExperienceCards({ localityId: locality.id })

  const stayCategoryLabels: Record<string, string> = {
    conferma_immediata: t.experience_cat_conferma_immediata,
    specialita_culinaria: t.experience_cat_specialita_culinaria,
    adrenalina_pura: t.experience_cat_adrenalina_pura,
  }

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
        <StayList stays={mockStays} lang={lang} categoryLabels={stayCategoryLabels} />
      </section>

      <LocationTipsSection
        title={interpolate(t.location_detail_poi_title, { name: locality.name })}
        tips={locality.tips ?? []}
      />
    </main>
  )
}
