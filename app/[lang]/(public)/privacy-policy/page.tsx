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
        <p className="mb-6 text-sm text-muted-foreground">{t.privacy_last_updated}</p>
        <p className="mb-10 leading-relaxed text-muted-foreground">{t.privacy_intro}</p>

        <div className="space-y-10 text-muted-foreground [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:leading-relaxed [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-1">
          <div>
            <h2>{t.privacy_operator_title}</h2>
            <p>{t.privacy_operator_intro}</p>
            <ul className="mt-2">
              <li>{t.privacy_operator_company}</li>
              <li>{t.privacy_operator_address}</li>
              <li>{t.privacy_operator_vat}</li>
              <li>{t.privacy_operator_rea}</li>
              <li>{t.privacy_operator_pec}</li>
              <li>{t.privacy_operator_email}</li>
              <li>{t.privacy_operator_phone}</li>
            </ul>
            <p className="mt-3">{t.privacy_operator_no_dpo}</p>
          </div>

          <div>
            <h2>{t.privacy_scope_title}</h2>
            <p>{t.privacy_scope_text}</p>
          </div>

          <div>
            <h2>{t.privacy_subjects_title}</h2>
            <p>{t.privacy_subjects_intro}</p>
            <ul>
              <li>{t.privacy_subjects_visitor}</li>
              <li>{t.privacy_subjects_user}</li>
              <li>{t.privacy_subjects_host}</li>
              <li>{t.privacy_subjects_applicant}</li>
              <li>{t.privacy_subjects_subscriber}</li>
            </ul>
          </div>

          <div>
            <h2>{t.privacy_categories_title}</h2>
            <p>{t.privacy_categories_intro}</p>
            <ul className="mt-2">
              <li>{t.privacy_categories_identification}</li>
              <li>{t.privacy_categories_contact}</li>
              <li>{t.privacy_categories_account}</li>
              <li>{t.privacy_categories_booking}</li>
              <li>{t.privacy_categories_payment}</li>
              <li>{t.privacy_categories_content}</li>
              <li>{t.privacy_categories_technical}</li>
              <li>{t.privacy_categories_marketing}</li>
              <li>{t.privacy_categories_consent}</li>
            </ul>
            <p className="mt-3">{t.privacy_categories_special}</p>
          </div>

          <div>
            <h2>{t.privacy_sources_title}</h2>
            <p>{t.privacy_sources_direct}</p>
            <p>{t.privacy_sources_third_party}</p>
          </div>

          <div>
            <h2>{t.privacy_purposes_title}</h2>
            <p>{t.privacy_purposes_intro}</p>
            <p>{t.privacy_purposes_account}</p>
            <p className="ml-4 text-sm italic">{t.privacy_purposes_account_basis}</p>
            <p>{t.privacy_purposes_booking}</p>
            <p className="ml-4 text-sm italic">{t.privacy_purposes_booking_basis}</p>
            <p>{t.privacy_purposes_orders}</p>
            <p className="ml-4 text-sm italic">{t.privacy_purposes_orders_basis}</p>
            <p>{t.privacy_purposes_payment}</p>
            <p className="ml-4 text-sm italic">{t.privacy_purposes_payment_basis}</p>
            <p>{t.privacy_purposes_communication}</p>
            <p className="ml-4 text-sm italic">{t.privacy_purposes_communication_basis}</p>
            <p>{t.privacy_purposes_security}</p>
            <p className="ml-4 text-sm italic">{t.privacy_purposes_security_basis}</p>
            <p>{t.privacy_purposes_analytics}</p>
            <p className="ml-4 text-sm italic">{t.privacy_purposes_analytics_basis}</p>
            <p>{t.privacy_purposes_marketing}</p>
            <p className="ml-4 text-sm italic">{t.privacy_purposes_marketing_basis}</p>
            <p>{t.privacy_purposes_reviews}</p>
            <p className="ml-4 text-sm italic">{t.privacy_purposes_reviews_basis}</p>
            <p>{t.privacy_purposes_dsa}</p>
            <p className="ml-4 text-sm italic">{t.privacy_purposes_dsa_basis}</p>
            <p>{t.privacy_purposes_legal}</p>
            <p className="ml-4 text-sm italic">{t.privacy_purposes_legal_basis}</p>
          </div>

          <div>
            <h2>{t.privacy_modality_title}</h2>
            <p>{t.privacy_modality_text}</p>
          </div>

          <div>
            <h2>{t.privacy_retention_title}</h2>
            <p>{t.privacy_retention_intro}</p>
            <ul>
              <li>{t.privacy_retention_account}</li>
              <li>{t.privacy_retention_booking}</li>
              <li>{t.privacy_retention_invoice}</li>
              <li>{t.privacy_retention_marketing}</li>
              <li>{t.privacy_retention_analytics}</li>
              <li>{t.privacy_retention_consent}</li>
              <li>{t.privacy_retention_logs}</li>
              <li>{t.privacy_retention_applications}</li>
            </ul>
            <p className="mt-3">{t.privacy_retention_legal_hold}</p>
          </div>

          <div>
            <h2>{t.privacy_recipients_title}</h2>
            <p>{t.privacy_recipients_intro}</p>
            <ul>
              <li>{t.privacy_recipients_stripe}</li>
              <li>{t.privacy_recipients_google}</li>
              <li>{t.privacy_recipients_apple}</li>
              <li>{t.privacy_recipients_aws}</li>
              <li>{t.privacy_recipients_uc}</li>
              <li>{t.privacy_recipients_mailerlite}</li>
              <li>{t.privacy_recipients_smtp}</li>
              <li>{t.privacy_recipients_hosts}</li>
              <li>{t.privacy_recipients_authorities}</li>
              <li>{t.privacy_recipients_advisors}</li>
            </ul>
          </div>

          <div>
            <h2>{t.privacy_transfers_title}</h2>
            <p>{t.privacy_transfers_intro}</p>
            <ul>
              <li>{t.privacy_transfers_dpf}</li>
              <li>{t.privacy_transfers_scc}</li>
            </ul>
            <p className="mt-3">{t.privacy_transfers_rights}</p>
          </div>

          <div>
            <h2>{t.privacy_rights_title}</h2>
            <p>{t.privacy_rights_intro}</p>
            <ul>
              <li>{t.privacy_rights_access}</li>
              <li>{t.privacy_rights_rectification}</li>
              <li>{t.privacy_rights_erasure}</li>
              <li>{t.privacy_rights_restriction}</li>
              <li>{t.privacy_rights_portability}</li>
              <li>{t.privacy_rights_objection}</li>
              <li>{t.privacy_rights_withdraw}</li>
              <li>{t.privacy_rights_adm}</li>
            </ul>
          </div>

          <div>
            <h2>{t.privacy_exercise_title}</h2>
            <p>{t.privacy_exercise_text}</p>
          </div>

          <div>
            <h2>{t.privacy_complaint_title}</h2>
            <p>{t.privacy_complaint_text}</p>
          </div>

          <div>
            <h2>{t.privacy_cookies_title}</h2>
            <p>{t.privacy_cookies_text}</p>
          </div>

          <div>
            <h2>{t.privacy_marketing_title}</h2>
            <p>{t.privacy_marketing_text}</p>
          </div>

          <div>
            <h2>{t.privacy_profiling_title}</h2>
            <p>{t.privacy_profiling_text}</p>
          </div>

          <div>
            <h2>{t.privacy_security_title}</h2>
            <p>{t.privacy_security_text}</p>
          </div>

          <div>
            <h2>{t.privacy_minors_title}</h2>
            <p>{t.privacy_minors_text}</p>
          </div>

          <div>
            <h2>{t.privacy_changes_title}</h2>
            <p>{t.privacy_changes_text}</p>
          </div>

          <div>
            <h2>{t.privacy_contact_title}</h2>
            <p>{t.privacy_contact_text}</p>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
