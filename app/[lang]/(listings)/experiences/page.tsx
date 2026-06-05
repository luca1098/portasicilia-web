import type { Metadata } from 'next'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps, PageSearchParamsProps } from '@/lib/types/page.type'
import { SupportedLocale } from '@/lib/configs/locales'
import { buildMetadata } from '@/lib/seo/metadata'
import { getExperienceCards } from '@/lib/api/experiences'
import { getLocalityById } from '@/lib/api/localities'
import { interpolate } from '@/lib/utils/i18n.utils'
import ExperienceCardGrid from '@/components/experience/experience-card-grid'
import ExperienceListing from '@/components/experience/experience-listing'
import ListingEmptyState from '@/components/shared/listing-empty-state'

const LISTING_PAGE_SIZE = 30

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

export default async function ExperiencesPage({
  params,
  searchParams,
}: PageParamsProps & PageSearchParamsProps) {
  const { lang } = await params
  const { localityId } = await searchParams

  const [t, { data: experienceCards, nextCursor }] = await Promise.all([
    getTranslations(lang as SupportedLocale),
    getExperienceCards({ localityId, limit: LISTING_PAGE_SIZE }),
  ])

  const isEmpty = experienceCards.length === 0
  const hasFilter = Boolean(localityId)

  let localityName: string | null = null
  let fallback: typeof experienceCards = []
  if (isEmpty && hasFilter) {
    const [locality, fallbackRes] = await Promise.all([
      getLocalityById(localityId as string, lang).catch(() => null),
      getExperienceCards({ limit: 12 }),
    ])
    localityName = locality?.name ?? null
    fallback = fallbackRes.data
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">{t.experiences_page_title}</h1>

      {isEmpty ? (
        <ListingEmptyState
          title={
            hasFilter && localityName
              ? interpolate(t.listing_empty_title_experiences_locality, { locality: localityName })
              : t.listing_empty_title_experiences_generic
          }
          subtitle={
            hasFilter
              ? t.listing_empty_subtitle_experiences_locality
              : t.listing_empty_subtitle_experiences_generic
          }
          ctaHref={hasFilter ? `/${lang}/experiences` : undefined}
          ctaLabel={hasFilter ? t.listing_empty_cta_show_all : undefined}
          suggestionsHeading={
            fallback.length > 0 ? t.listing_empty_suggestions_heading_experiences : undefined
          }
        >
          {fallback.length > 0 && <ExperienceCardGrid experiences={fallback} lang={lang} />}
        </ListingEmptyState>
      ) : (
        <ExperienceListing
          initialExperiences={experienceCards}
          initialCursor={nextCursor}
          limit={LISTING_PAGE_SIZE}
          lang={lang}
          localityId={localityId as string | undefined}
        />
      )}
    </main>
  )
}
