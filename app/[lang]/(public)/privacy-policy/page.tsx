import type { Metadata } from 'next'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { buildMetadata } from '@/lib/seo/metadata'
import PageWrapper from '@/components/layout/page-wrapper'

const PRIVACY_POLICY_ID = 'fefe4ef6-d4a4-4d26-8d62-d1521bcace5e'

export async function generateMetadata({ params }: PageParamsProps): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)
  return buildMetadata({
    title: t.seo_privacy_title,
    description: t.seo_privacy_title,
    path: 'privacy-policy',
    locale: lang,
    noIndex: true,
  })
}

async function fetchPrivacyPolicyHtml(language: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://policygenerator.usercentrics.eu/api/embedding?id=${PRIVACY_POLICY_ID}&language=${language}`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

export default async function PrivacyPolicyPage({ params }: PageParamsProps) {
  const { lang } = await params
  const html = await fetchPrivacyPolicyHtml(lang)

  return (
    <PageWrapper>
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        {html ? (
          <div className="uc-privacy-policy" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="uc-privacy-policy" />
        )}
      </section>
    </PageWrapper>
  )
}
