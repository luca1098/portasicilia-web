import type { Metadata } from 'next'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps, PageSearchParamsProps } from '@/lib/types/page.type'
import { SupportedLocale } from '@/lib/configs/locales'
import { buildMetadata } from '@/lib/seo/metadata'
import { getStayCards } from '@/lib/api/stays'
import { getLocalityById } from '@/lib/api/localities'
import { interpolate } from '@/lib/utils/i18n.utils'
import StayGrid from '@/components/stay/stay-grid'
import ListingEmptyState from '@/components/shared/listing-empty-state'

export async function generateMetadata({ params }: PageParamsProps): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)
  return buildMetadata({
    title: t.seo_stays_title,
    description: t.seo_stays_description,
    path: 'stays',
    locale: lang,
  })
}

export default async function StaysPage({ params, searchParams }: PageParamsProps & PageSearchParamsProps) {
  const { lang } = await params
  const { localityId } = await searchParams

  const [t, { data: stayCards }] = await Promise.all([
    getTranslations(lang as SupportedLocale),
    getStayCards({ localityId }),
  ])

  const isEmpty = stayCards.length === 0
  const hasFilter = Boolean(localityId)

  let localityName: string | null = null
  let fallback: typeof stayCards = []
  if (isEmpty && hasFilter) {
    const [locality, fallbackRes] = await Promise.all([
      getLocalityById(localityId as string, lang).catch(() => null),
      getStayCards({ limit: 12 }),
    ])
    localityName = locality?.name ?? null
    fallback = fallbackRes.data
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">{t.stays_page_title}</h1>

      {isEmpty ? (
        <ListingEmptyState
          title={
            hasFilter && localityName
              ? interpolate(t.listing_empty_title_stays_locality, { locality: localityName })
              : t.listing_empty_title_stays_generic
          }
          subtitle={
            hasFilter ? t.listing_empty_subtitle_stays_locality : t.listing_empty_subtitle_stays_generic
          }
          ctaHref={hasFilter ? `/${lang}/stays` : undefined}
          ctaLabel={hasFilter ? t.listing_empty_cta_show_all : undefined}
          suggestionsHeading={fallback.length > 0 ? t.listing_empty_suggestions_heading_stays : undefined}
        >
          {fallback.length > 0 && <StayGrid stays={fallback} lang={lang} />}
        </ListingEmptyState>
      ) : (
        <StayGrid stays={stayCards} lang={lang} />
      )}
    </main>
  )
}
