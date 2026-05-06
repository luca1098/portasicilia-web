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
    title: t.seo_privacy_title,
    description: t.seo_privacy_title,
    path: 'privacy-policy',
    locale: lang,
    noIndex: true,
  })
}

export default async function PrivacyPolicyPage({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  return (
    <PageWrapper>
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">{t.privacy_title}</h1>
        <p className="mb-1 text-sm text-muted-foreground">{t.privacy_last_updated}: 23-05-2025</p>
        <p className="mb-10 text-sm text-muted-foreground">{t.privacy_effective_date}: 23-05-2025</p>

        <div className="space-y-8 text-muted-foreground [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:leading-relaxed [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-1">
          <p>{t.privacy_intro}</p>
          <p>{t.privacy_modifications}</p>

          <div>
            <h2>{t.privacy_info_collect_title}</h2>
            <p>{t.privacy_info_collect_desc}</p>
            <ul>
              <li>{t.privacy_info_collect_name}</li>
              <li>{t.privacy_info_collect_email}</li>
              <li>{t.privacy_info_collect_address}</li>
            </ul>
          </div>

          <div>
            <h2>{t.privacy_how_collect_title}</h2>
            <p>{t.privacy_how_collect_desc}</p>
            <ul>
              <li>{t.privacy_how_collect_registration}</li>
              <li>{t.privacy_how_collect_interaction}</li>
              <li>{t.privacy_how_collect_public}</li>
            </ul>
          </div>

          <div>
            <h2>{t.privacy_how_use_title}</h2>
            <p>{t.privacy_how_use_desc}</p>
            <ul>
              <li>{t.privacy_how_use_marketing}</li>
              <li>{t.privacy_how_use_tnc}</li>
              <li>{t.privacy_how_use_payment}</li>
              <li>{t.privacy_how_use_orders}</li>
            </ul>
            <p className="mt-3">{t.privacy_how_use_consent}</p>
          </div>

          <div>
            <h2>{t.privacy_how_share_title}</h2>
            <p>{t.privacy_how_share_desc}</p>
            <ul>
              <li>{t.privacy_how_share_analytics}</li>
            </ul>
            <p className="mt-3">{t.privacy_how_share_third_party}</p>
            <p>{t.privacy_how_share_disclosure}</p>
          </div>

          <div>
            <h2>{t.privacy_retention_title}</h2>
            <p>{t.privacy_retention_desc}</p>
          </div>

          <div>
            <h2>{t.privacy_rights_title}</h2>
            <p>{t.privacy_rights_desc}</p>
            <p>{t.privacy_rights_note}</p>
          </div>

          <div>
            <h2>{t.privacy_cookies_title}</h2>
            <p>{t.privacy_cookies_desc}</p>
          </div>

          <div>
            <h2>{t.privacy_security_title}</h2>
            <p>{t.privacy_security_desc}</p>
          </div>

          <div>
            <h2>{t.privacy_third_party_title}</h2>
            <p>{t.privacy_third_party_desc}</p>
          </div>

          <div>
            <h2>{t.privacy_grievance_title}</h2>
            <p>{t.privacy_grievance_desc}</p>
          </div>

          <p className="text-xs text-muted-foreground/60">Privacy Policy generated with CookieYes.</p>
        </div>
      </section>
    </PageWrapper>
  )
}
