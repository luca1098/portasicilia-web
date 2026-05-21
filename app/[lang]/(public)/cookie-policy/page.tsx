import type { Metadata } from 'next'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { buildMetadata } from '@/lib/seo/metadata'
import PageWrapper from '@/components/layout/page-wrapper'
import CookieSettingsButton from '@/components/consent/cookie-settings-button'

export async function generateMetadata({ params }: PageParamsProps): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)
  return buildMetadata({
    title: t.seo_cookie_policy_title,
    description: t.seo_cookie_policy_title,
    path: 'cookie-policy',
    locale: lang,
    noIndex: true,
  })
}

export default async function CookiePolicyPage({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  return (
    <PageWrapper>
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">{t.cookie_policy_title}</h1>
        <p className="mb-10 text-sm text-muted-foreground">{t.cookie_policy_last_updated}</p>

        <div className="space-y-10 text-muted-foreground [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-foreground [&_p]:leading-relaxed">
          <div>
            <h2>{t.cookie_policy_intro_title}</h2>
            <p>{t.cookie_policy_intro_text}</p>
          </div>

          <div>
            <h2>{t.cookie_policy_types_title}</h2>
            <p>{t.cookie_policy_types_intro}</p>

            <h3>{t.cookie_policy_essential_title}</h3>
            <p>{t.cookie_policy_essential_text}</p>

            <h3>{t.cookie_policy_functional_title}</h3>
            <p>{t.cookie_policy_functional_text}</p>

            <h3>{t.cookie_policy_analytics_title}</h3>
            <p>{t.cookie_policy_analytics_text}</p>

            <h3>{t.cookie_policy_marketing_title}</h3>
            <p>{t.cookie_policy_marketing_text}</p>
          </div>

          <div>
            <h2>{t.cookie_policy_third_parties_title}</h2>
            <p>{t.cookie_policy_third_parties_intro}</p>

            <h3>{t.cookie_policy_uc_title}</h3>
            <p>{t.cookie_policy_uc_text}</p>

            <h3>{t.cookie_policy_ga_title}</h3>
            <p>{t.cookie_policy_ga_text}</p>

            <h3>{t.cookie_policy_stripe_title}</h3>
            <p>{t.cookie_policy_stripe_text}</p>
          </div>

          <div>
            <h2>{t.cookie_policy_manage_title}</h2>
            <p>{t.cookie_policy_manage_text}</p>
            <div className="mt-4">
              <CookieSettingsButton label={t.cookie_policy_manage_button} />
            </div>
          </div>

          <div>
            <h2>{t.cookie_policy_changes_title}</h2>
            <p>{t.cookie_policy_changes_text}</p>
          </div>

          <div>
            <h2>{t.cookie_policy_contact_title}</h2>
            <p>{t.cookie_policy_contact_text}</p>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
