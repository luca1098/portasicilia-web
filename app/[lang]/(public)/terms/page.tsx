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
    title: t.seo_terms_title,
    description: t.seo_terms_title,
    path: 'terms',
    locale: lang,
    noIndex: true,
  })
}

export default async function TermsPage({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  return (
    <PageWrapper>
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">{t.terms_title}</h1>
        <p className="mb-10 text-sm text-muted-foreground">{t.terms_last_updated}</p>

        <div className="space-y-10 text-muted-foreground [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-foreground [&_p]:leading-relaxed [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-1">
          <div>
            <h2>{t.terms_operator_title}</h2>
            <p>{t.terms_operator_intro}</p>
            <ul className="mt-2">
              <li>{t.terms_operator_company}</li>
              <li>{t.terms_operator_address}</li>
              <li>{t.terms_operator_vat}</li>
              <li>{t.terms_operator_rea}</li>
              <li>{t.terms_operator_pec}</li>
              <li>{t.terms_operator_email}</li>
              <li>{t.terms_operator_phone}</li>
            </ul>
            <p className="mt-3">{t.terms_operator_brand}</p>
          </div>

          <div>
            <h2>{t.terms_defs_title}</h2>
            <p>{t.terms_defs_intro}</p>
            <ul className="mt-2">
              <li>{t.terms_defs_user}</li>
              <li>{t.terms_defs_host}</li>
              <li>{t.terms_defs_platform}</li>
              <li>{t.terms_defs_service}</li>
              <li>{t.terms_defs_product}</li>
              <li>{t.terms_defs_booking}</li>
              <li>{t.terms_defs_commission}</li>
            </ul>
          </div>

          <div>
            <h2>{t.terms_acceptance_title}</h2>
            <p>{t.terms_acceptance_text_1}</p>
            <p>{t.terms_acceptance_text_2}</p>
            <p>{t.terms_acceptance_text_3}</p>
          </div>

          <div>
            <h2>{t.terms_age_title}</h2>
            <p>{t.terms_age_text}</p>
          </div>

          <div>
            <h2>{t.terms_auth_title}</h2>
            <p>{t.terms_auth_intro}</p>
            <p>{t.terms_auth_google}</p>
            <p>{t.terms_auth_apple}</p>
            <p>{t.terms_auth_credentials}</p>
          </div>

          <div>
            <h2>{t.terms_platform_title}</h2>
            <p>{t.terms_platform_intro}</p>

            <h3>{t.terms_platform_exp_title}</h3>
            <p>{t.terms_platform_exp_text}</p>
            <ul>
              <li>{t.terms_platform_exp_item_1}</li>
              <li>{t.terms_platform_exp_item_2}</li>
              <li>{t.terms_platform_exp_item_3}</li>
            </ul>
            <p className="mt-3">{t.terms_platform_exp_no_confirm}</p>

            <h3>{t.terms_platform_stay_title}</h3>
            <p>{t.terms_platform_stay_text}</p>
            <ul>
              <li>{t.terms_platform_stay_item_1}</li>
              <li>{t.terms_platform_stay_item_2}</li>
              <li>{t.terms_platform_stay_item_3}</li>
            </ul>

            <h3>{t.terms_platform_shop_title}</h3>
            <p>{t.terms_platform_shop_text}</p>
          </div>

          <div>
            <h2>{t.terms_payments_title}</h2>
            <p>{t.terms_payments_stripe}</p>
            <p>{t.terms_payments_sca}</p>
            <p>{t.terms_payments_transfer}</p>
            <p>{t.terms_payments_methods}</p>
            <p>{t.terms_payments_prices}</p>
            <p>{t.terms_payments_invoice}</p>
          </div>

          <div>
            <h2>{t.terms_cancel_title}</h2>
            <p>{t.terms_cancel_framework}</p>

            <h3>{t.terms_cancel_exp_title}</h3>
            <p>{t.terms_cancel_exp_free}</p>
            <p>{t.terms_cancel_exp_late}</p>
            <p>{t.terms_cancel_exp_noshow}</p>

            <h3>{t.terms_cancel_stay_title}</h3>
            <p>{t.terms_cancel_stay_30}</p>
            <p>{t.terms_cancel_stay_late}</p>

            <h3>{t.terms_cancel_stay_issues_title}</h3>
            <p>{t.terms_cancel_stay_issues_text}</p>
            <ul>
              <li>{t.terms_cancel_stay_issues_item_1}</li>
              <li>{t.terms_cancel_stay_issues_item_2}</li>
            </ul>

            <h3>{t.terms_cancel_refund_title}</h3>
            <p>{t.terms_cancel_refund_text_1}</p>
            <p>{t.terms_cancel_refund_text_2}</p>
          </div>

          <div>
            <h2>{t.terms_food_title}</h2>
            <p>{t.terms_food_labeling}</p>
            <p>{t.terms_food_shipping}</p>
            <p>{t.terms_food_delays}</p>
            <p>{t.terms_food_orders}</p>
            <p>{t.terms_food_guarantee}</p>
          </div>

          <div>
            <h2>{t.terms_food_withdrawal_title}</h2>
            <p>{t.terms_food_withdrawal_text_1}</p>
            <p>{t.terms_food_withdrawal_exceptions}</p>
            <p>{t.terms_food_withdrawal_procedure}</p>
          </div>

          <div>
            <h2>{t.terms_user_obligations_title}</h2>
            <p>{t.terms_user_obligations_text}</p>
            <p>{t.terms_user_obligations_cases}</p>
            <ul>
              <li>{t.terms_user_obligations_item_1}</li>
              <li>{t.terms_user_obligations_item_2}</li>
              <li>{t.terms_user_obligations_item_3}</li>
            </ul>
            <p className="mt-3">{t.terms_user_obligations_note}</p>
            <p>{t.terms_user_obligations_responsible_use}</p>
          </div>

          <div>
            <h2>{t.terms_chargeback_title}</h2>
            <p>{t.terms_chargeback_text_1}</p>
            <p>{t.terms_chargeback_text_2}</p>
            <p>{t.terms_chargeback_text_3}</p>
          </div>

          <div>
            <h2>{t.terms_liability_title}</h2>
            <p>{t.terms_liability_intermediary}</p>
            <ul>
              <li>{t.terms_liability_item_1}</li>
              <li>{t.terms_liability_item_2}</li>
              <li>{t.terms_liability_item_3}</li>
            </ul>
            <p className="mt-3">{t.terms_liability_limits}</p>
            <p>{t.terms_liability_carveout}</p>
          </div>

          <div>
            <h2>{t.terms_reviews_title}</h2>
            <p>{t.terms_reviews_authenticity}</p>
            <p>{t.terms_reviews_rules}</p>
            <p>{t.terms_reviews_moderation}</p>
          </div>

          <div>
            <h2>{t.terms_ip_title}</h2>
            <p>{t.terms_ip_ownership}</p>
            <p>{t.terms_ip_reserved}</p>
            <p>{t.terms_ip_user_content}</p>
            <p>{t.terms_ip_third_party}</p>
          </div>

          <div>
            <h2>{t.terms_dsa_title}</h2>
            <p>{t.terms_dsa_intro}</p>
            <p>{t.terms_dsa_procedure}</p>
            <p>{t.terms_dsa_appeal}</p>
            <p>{t.terms_dsa_authority}</p>
          </div>

          <div>
            <h2>{t.terms_cookies_title}</h2>
            <p>{t.terms_cookies_text}</p>
          </div>

          <div>
            <h2>{t.terms_translation_title}</h2>
            <p>{t.terms_translation_prevailing}</p>
            <p>{t.terms_translation_auto}</p>
          </div>

          <div>
            <h2>{t.terms_privacy_title}</h2>
            <p>{t.terms_privacy_text}</p>
          </div>

          <div>
            <h2>{t.terms_host_title}</h2>
            <p>{t.terms_host_text_1}</p>
            <p>{t.terms_host_text_2}</p>
          </div>

          <div>
            <h2>{t.terms_termination_title}</h2>
            <p>{t.terms_termination_text}</p>
          </div>

          <div>
            <h2>{t.terms_changes_title}</h2>
            <p>{t.terms_changes_text}</p>
          </div>

          <div>
            <h2>{t.terms_law_title}</h2>
            <p>{t.terms_law_text_1}</p>
            <p>{t.terms_law_text_2}</p>
            <p>{t.terms_law_severability}</p>
          </div>

          <div>
            <h2>{t.terms_odr_title}</h2>
            <p>{t.terms_odr_text_1}</p>
            <p>{t.terms_odr_text_2}</p>
          </div>

          <div>
            <h2>{t.terms_misc_title}</h2>
            <p>{t.terms_misc_entire}</p>
            <p>{t.terms_misc_waiver}</p>
            <p>{t.terms_misc_assignment}</p>
            <p>{t.terms_misc_affiliate}</p>
          </div>

          <div>
            <h2>{t.terms_contact_title}</h2>
            <p>{t.terms_contact_text}</p>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
