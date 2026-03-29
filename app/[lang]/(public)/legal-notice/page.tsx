import type { Metadata } from 'next'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { buildMetadata } from '@/lib/seo/metadata'
import PageWrapper from '@/components/layout/page-wrapper'

export async function generateMetadata({ params }: PageParamsProps): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)
  return buildMetadata({
    title: t.seo_legal_notice_title,
    description: t.seo_legal_notice_title,
    path: 'legal-notice',
    locale: lang,
    noIndex: true,
  })
}

export default async function LegalNoticePage({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  return (
    <PageWrapper>
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <h1 className="mb-10 text-4xl font-bold tracking-tight">{t.legal_notice_title}</h1>

        <div className="space-y-8 text-muted-foreground [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:leading-relaxed">
          <div>
            <h2>{t.legal_notice_seller_title}</h2>
            <p>GUARNERI SALVATORE</p>
            <p>{t.legal_notice_address}: Cortile Gonzales 7, 90025 Lercara Friddi (PA), Italia</p>
            <p>{t.legal_notice_vat}: 07069930829</p>
            <p>{t.legal_notice_phone}: 327 4522382</p>
          </div>

          <div>
            <h2>{t.legal_notice_subject_title}</h2>
            <p>{t.legal_notice_subject_desc}</p>
          </div>

          <div>
            <h2>{t.legal_notice_liability_title}</h2>
            <p>{t.legal_notice_liability_desc}</p>
          </div>

          <div>
            <h2>{t.legal_notice_ip_title}</h2>
            <p>{t.legal_notice_ip_desc}</p>
          </div>

          <div>
            <h2>{t.legal_notice_external_links_title}</h2>
            <p>{t.legal_notice_external_links_desc}</p>
          </div>

          <div>
            <h2>{t.legal_notice_jurisdiction_title}</h2>
            <p>{t.legal_notice_jurisdiction_desc}</p>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
