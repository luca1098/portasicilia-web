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
    title: t.seo_partner_terms_title,
    description: t.seo_partner_terms_title,
    path: 'partner-terms',
    locale: lang,
    noIndex: true,
  })
}

export default async function PartnerTermsPage({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  return (
    <PageWrapper>
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">{t.partner_terms_title}</h1>
        <p className="mb-10 text-sm text-muted-foreground">{t.partner_terms_last_updated}</p>

        <div className="space-y-10 text-muted-foreground [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-foreground [&_p]:leading-relaxed [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-1">
          <div>
            <h2>{t.partner_terms_intro_title}</h2>
            <p>{t.partner_terms_intro_text_1}</p>
            <p>{t.partner_terms_intro_text_2}</p>
            <p>{t.partner_terms_intro_text_3}</p>
          </div>

          <div>
            <h2>{t.partner_terms_defs_title}</h2>
            <p>{t.partner_terms_defs_intro}</p>
            <ul className="mt-2">
              <li>{t.partner_terms_defs_partner}</li>
              <li>{t.partner_terms_defs_listing}</li>
              <li>{t.partner_terms_defs_dashboard}</li>
              <li>{t.partner_terms_defs_commission}</li>
            </ul>
          </div>

          <div>
            <h2>{t.partner_terms_identity_title}</h2>
            <p>{t.partner_terms_identity_text_1}</p>
            <p>{t.partner_terms_identity_text_2}</p>
            <p>{t.partner_terms_identity_text_3}</p>
          </div>

          <div>
            <h2>{t.partner_terms_onboarding_title}</h2>
            <p>{t.partner_terms_onboarding_text}</p>
          </div>

          <div>
            <h2>{t.partner_terms_listing_title}</h2>
            <p>{t.partner_terms_listing_accuracy}</p>
            <p>{t.partner_terms_listing_photos}</p>
            <p>{t.partner_terms_listing_prices}</p>
            <p>{t.partner_terms_listing_availability}</p>
            <p>{t.partner_terms_listing_changes}</p>
          </div>

          <div>
            <h2>{t.partner_terms_commission_title}</h2>
            <p>{t.partner_terms_commission_structure}</p>
            <p>{t.partner_terms_commission_changes}</p>
            <p>{t.partner_terms_commission_transparency}</p>
          </div>

          <div>
            <h2>{t.partner_terms_payouts_title}</h2>
            <p>{t.partner_terms_payouts_text_1}</p>
            <p>{t.partner_terms_payouts_text_2}</p>
            <p>{t.partner_terms_payouts_taxes}</p>
            <p>{t.partner_terms_payouts_holds}</p>
          </div>

          <div>
            <h2>{t.partner_terms_obligations_title}</h2>
            <p>{t.partner_terms_obligations_response_time}</p>
            <p>{t.partner_terms_obligations_execution}</p>
            <p>{t.partner_terms_obligations_safety}</p>
            <p>{t.partner_terms_obligations_insurance}</p>
            <p>{t.partner_terms_obligations_communication}</p>
          </div>

          <div>
            <h2>{t.partner_terms_compliance_title}</h2>
            <p>{t.partner_terms_compliance_text_1}</p>
            <ul>
              <li>{t.partner_terms_compliance_item_1}</li>
              <li>{t.partner_terms_compliance_item_2}</li>
              <li>{t.partner_terms_compliance_item_3}</li>
              <li>{t.partner_terms_compliance_item_4}</li>
              <li>{t.partner_terms_compliance_item_5}</li>
            </ul>
            <p className="mt-3">{t.partner_terms_compliance_text_2}</p>
          </div>

          <div>
            <h2>{t.partner_terms_cancellations_title}</h2>
            <p>{t.partner_terms_cancellations_text_1}</p>
            <p>{t.partner_terms_cancellations_text_2}</p>
            <p>{t.partner_terms_cancellations_text_3}</p>
          </div>

          <div>
            <h2>{t.partner_terms_reviews_title}</h2>
            <p>{t.partner_terms_reviews_text_1}</p>
            <p>{t.partner_terms_reviews_text_2}</p>
            <p>{t.partner_terms_reviews_text_3}</p>
          </div>

          <div>
            <h2>{t.partner_terms_ip_title}</h2>
            <p>{t.partner_terms_ip_text_1}</p>
            <p>{t.partner_terms_ip_text_2}</p>
            <p>{t.partner_terms_ip_text_3}</p>
          </div>

          <div>
            <h2>{t.partner_terms_privacy_title}</h2>
            <p>{t.partner_terms_privacy_text_1}</p>
            <p>{t.partner_terms_privacy_text_2}</p>
            <p>{t.partner_terms_privacy_text_3}</p>
          </div>

          <div>
            <h2>{t.partner_terms_partner_liability_title}</h2>
            <p>{t.partner_terms_partner_liability_text_1}</p>
            <p>{t.partner_terms_partner_liability_text_2}</p>
          </div>

          <div>
            <h2>{t.partner_terms_platform_liability_title}</h2>
            <p>{t.partner_terms_platform_liability_text_1}</p>
            <p>{t.partner_terms_platform_liability_text_2}</p>
          </div>

          <div>
            <h2>{t.partner_terms_suspension_title}</h2>
            <p>{t.partner_terms_suspension_text_1}</p>
            <p>{t.partner_terms_suspension_text_2}</p>
            <ul>
              <li>{t.partner_terms_suspension_item_1}</li>
              <li>{t.partner_terms_suspension_item_2}</li>
              <li>{t.partner_terms_suspension_item_3}</li>
            </ul>
            <p className="mt-3">{t.partner_terms_suspension_text_3}</p>
          </div>

          <div>
            <h2>{t.partner_terms_complaints_title}</h2>
            <p>{t.partner_terms_complaints_text_1}</p>
            <p>{t.partner_terms_complaints_text_2}</p>
          </div>

          <div>
            <h2>{t.partner_terms_mediation_title}</h2>
            <p>{t.partner_terms_mediation_text}</p>
          </div>

          <div>
            <h2>{t.partner_terms_ranking_title}</h2>
            <p>{t.partner_terms_ranking_text_1}</p>
            <p>{t.partner_terms_ranking_text_2}</p>
            <p>{t.partner_terms_ranking_text_3}</p>
          </div>

          <div>
            <h2>{t.partner_terms_changes_title}</h2>
            <p>{t.partner_terms_changes_text}</p>
          </div>

          <div>
            <h2>{t.partner_terms_law_title}</h2>
            <p>{t.partner_terms_law_text_1}</p>
            <p>{t.partner_terms_law_text_2}</p>
          </div>

          <div>
            <h2>{t.partner_terms_misc_title}</h2>
            <p>{t.partner_terms_misc_assignment}</p>
            <p>{t.partner_terms_misc_severability}</p>
            <p>{t.partner_terms_misc_communications}</p>
            <p>{t.partner_terms_misc_confidentiality}</p>
          </div>

          <div>
            <h2>{t.partner_terms_contact_title}</h2>
            <p>{t.partner_terms_contact_text}</p>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
