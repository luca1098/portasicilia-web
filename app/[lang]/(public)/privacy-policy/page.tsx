import type { Metadata } from 'next'
import Script from 'next/script'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { buildMetadata } from '@/lib/seo/metadata'
import PageWrapper from '@/components/layout/page-wrapper'

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

export default async function PrivacyPolicyPage({ params }: PageParamsProps) {
  const { lang } = await params

  return (
    <PageWrapper>
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <div className="uc-privacy-policy" />
        <Script
          id="usercentrics-ppg"
          src="https://policygenerator.usercentrics.eu/api/privacy-policy"
          strategy="afterInteractive"
          privacy-policy-id="fefe4ef6-d4a4-4d26-8d62-d1521bcace5e"
          data-language={lang}
        />
      </section>
    </PageWrapper>
  )
}
