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
    title: t.seo_cancellation_policy_title,
    description: t.seo_cancellation_policy_title,
    path: 'cancellation-policy',
    locale: lang,
    noIndex: true,
  })
}

export default async function CancellationPolicyPage({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  return (
    <PageWrapper>
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">{t.cancellation_policy_title}</h1>
        <p className="mb-10 text-sm text-muted-foreground">{t.cancellation_policy_last_updated}</p>

        <div className="space-y-10 text-muted-foreground [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-foreground [&_p]:leading-relaxed [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-1">
          <div>
            <h2>{t.cancellation_policy_intro_title}</h2>
            <p>{t.cancellation_policy_intro_text}</p>
            <p>{t.cancellation_policy_framework_note}</p>
          </div>

          <div>
            <h2>{t.terms_cancel_exp_title}</h2>
            <p>{t.terms_cancel_exp_free}</p>
            <p>{t.terms_cancel_exp_late}</p>
            <p>{t.terms_cancel_exp_noshow}</p>
          </div>

          <div>
            <h2>{t.terms_cancel_stay_title}</h2>
            <p>{t.terms_cancel_stay_30}</p>
            <p>{t.terms_cancel_stay_late}</p>

            <h3>{t.terms_cancel_stay_issues_title}</h3>
            <p>{t.terms_cancel_stay_issues_text}</p>
            <ul>
              <li>{t.terms_cancel_stay_issues_item_1}</li>
              <li>{t.terms_cancel_stay_issues_item_2}</li>
            </ul>
          </div>

          <div>
            <h2>{t.terms_food_withdrawal_title}</h2>
            <p>{t.cancellation_policy_food_note}</p>
            <p>{t.terms_food_withdrawal_exceptions}</p>
            <p>{t.terms_food_withdrawal_procedure}</p>
          </div>

          <div>
            <h2>{t.cancellation_policy_procedure_title}</h2>
            <p>{t.cancellation_policy_procedure_text}</p>
          </div>

          <div>
            <h2>{t.cancellation_policy_contact_title}</h2>
            <p>{t.cancellation_policy_contact_text}</p>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
