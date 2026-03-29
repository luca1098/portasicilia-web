import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'
import { buildListingMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/lib/seo/json-ld'
import { staySchema, breadcrumbSchema } from '@/lib/seo/schema'
import { SITE_URL } from '@/lib/seo/constants'
import { getStayBySlug } from '@/lib/api/stays'
import { ApiError } from '@/lib/api/fetch-client'
import StayDetailContent from '@/components/stay/detail/stay-detail-content'

export const dynamic = 'force-dynamic'

type StayDetailPageProps = {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateMetadata({ params }: StayDetailPageProps): Promise<Metadata> {
  const { lang, slug } = await params
  try {
    const [t, stay] = await Promise.all([getTranslations(lang as SupportedLocale), getStayBySlug(slug, lang)])
    return buildListingMetadata(stay, 'stays', lang, t.seo_stay_suffix)
  } catch {
    return {}
  }
}

export default async function StayDetailPage({ params }: StayDetailPageProps) {
  const { lang, slug } = await params
  const t = await getTranslations(lang as SupportedLocale)

  let stay
  try {
    stay = await getStayBySlug(slug, lang)
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
            { name: t.seo_breadcrumb_stays, url: `${SITE_URL}/${lang}/stays` },
            { name: stay.name, url: `${SITE_URL}/${lang}/stays/${stay.slug}` },
          ]),
          staySchema(stay, lang),
        ]}
      />
      <StayDetailContent stay={stay} lang={lang} />
    </>
  )
}
