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
        <h1 className="mb-10 text-4xl font-bold tracking-tight">{t.terms_title}</h1>

        <div className="space-y-8 text-muted-foreground [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-foreground [&_p]:leading-relaxed [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-1">
          <div>
            <h2>1. {t.terms_1_title}</h2>
            <p>{t.terms_1_text}</p>
          </div>

          <div>
            <h2>2. {t.terms_2_title}</h2>
            <p>{t.terms_2_text}</p>
          </div>

          <div>
            <h2>3. {t.terms_3_title}</h2>
            <p>{t.terms_3_text}</p>
          </div>

          <div>
            <h2>4. {t.terms_4_title}</h2>
            <p>{t.terms_4_text}</p>
            <h3 className="mt-4">4.1 {t.terms_4_1_title}</h3>
            <p>{t.terms_4_1_text}</p>
          </div>

          <div>
            <h2>5. {t.terms_5_title}</h2>
            <p>{t.terms_5_text_1}</p>
            <p>{t.terms_5_text_2}</p>
          </div>

          <div>
            <h2>6. {t.terms_6_title}</h2>
            <p>{t.terms_6_text_1}</p>
            <p>{t.terms_6_text_2}</p>
          </div>

          <div>
            <h2>7. {t.terms_7_title}</h2>

            <h3 className="mt-4">7.1 {t.terms_7_1_title}</h3>
            <p>{t.terms_7_1_text_1}</p>
            <p>{t.terms_7_1_text_2}</p>
            <p>{t.terms_7_1_text_3}</p>

            <h3 className="mt-6">7.2 {t.terms_7_2_title}</h3>
            <p>{t.terms_7_2_text}</p>
            <ul>
              <li>{t.terms_7_2_item_1}</li>
              <li>{t.terms_7_2_item_2}</li>
              <li>{t.terms_7_2_item_3}</li>
            </ul>
            <p className="mt-3">{t.terms_7_2_no_confirm}</p>

            <h3 className="mt-6">{t.terms_7_2_cancel_title}</h3>
            <p>{t.terms_7_2_cancel_free}</p>
            <p>{t.terms_7_2_cancel_late}</p>
            <p>{t.terms_7_2_cancel_noshow}</p>

            <h3 className="mt-6">7.3 {t.terms_7_3_title}</h3>
            <p>{t.terms_7_3_text}</p>
            <ul>
              <li>{t.terms_7_3_item_1}</li>
              <li>{t.terms_7_3_item_2}</li>
              <li>{t.terms_7_3_item_3}</li>
            </ul>

            <h3 className="mt-6">{t.terms_7_3_cancel_title}</h3>
            <p>{t.terms_7_3_cancel_30}</p>
            <p>{t.terms_7_3_cancel_late}</p>

            <h3 className="mt-4">{t.terms_7_3_issues_title}</h3>
            <p>{t.terms_7_3_issues_text}</p>
            <ul>
              <li>{t.terms_7_3_issues_item_1}</li>
              <li>{t.terms_7_3_issues_item_2}</li>
            </ul>

            <h3 className="mt-6">7.4 {t.terms_7_4_title}</h3>
            <p>{t.terms_7_4_text_1}</p>
            <p>{t.terms_7_4_text_2}</p>
          </div>

          <div>
            <h2>8. {t.terms_8_title}</h2>

            <h3 className="mt-4">8.1 {t.terms_8_1_title}</h3>
            <p>{t.terms_8_1_text}</p>
            <ul>
              <li>{t.terms_8_1_item_1}</li>
              <li>{t.terms_8_1_item_2}</li>
              <li>{t.terms_8_1_item_3}</li>
            </ul>
            <p className="mt-3">{t.terms_8_1_note}</p>

            <h3 className="mt-6">8.2 {t.terms_8_2_title}</h3>
            <p>{t.terms_8_2_text}</p>
            <p>{t.terms_8_2_cases}</p>
            <ul>
              <li>{t.terms_8_2_item_1}</li>
              <li>{t.terms_8_2_item_2}</li>
              <li>{t.terms_8_2_item_3}</li>
            </ul>
            <p className="mt-3">{t.terms_8_2_note}</p>

            <h3 className="mt-6">8.3 {t.terms_8_3_title}</h3>
            <p>{t.terms_8_3_text}</p>
            <ul>
              <li>{t.terms_8_3_item_1}</li>
              <li>{t.terms_8_3_item_2}</li>
              <li>{t.terms_8_3_item_3}</li>
              <li>{t.terms_8_3_item_4}</li>
            </ul>
            <p className="mt-3">{t.terms_8_3_note}</p>

            <h3 className="mt-6">8.4 {t.terms_8_4_title}</h3>
            <p>{t.terms_8_4_text_1}</p>
            <p>{t.terms_8_4_text_2}</p>
            <p>{t.terms_8_4_text_3}</p>
          </div>

          <div>
            <h2>9. {t.terms_9_title}</h2>
            <p>{t.terms_9_text}</p>
          </div>

          <div>
            <h2>10. {t.terms_10_title}</h2>
            <p>{t.terms_10_text}</p>
          </div>

          <div>
            <h2>11. {t.terms_11_title}</h2>
            <p>{t.terms_11_text_1}</p>
            <ul>
              <li>{t.terms_11_item_1}</li>
              <li>{t.terms_11_item_2}</li>
            </ul>
            <p className="mt-3">{t.terms_11_text_2}</p>
            <p>{t.terms_11_text_3}</p>
            <p>{t.terms_11_text_4}</p>
          </div>

          <div>
            <h2>12. {t.terms_12_title}</h2>
            <p>{t.terms_12_text}</p>
          </div>

          <div>
            <h2>13. {t.terms_13_title}</h2>
            <p>{t.terms_13_text}</p>
          </div>

          <div>
            <h2>14. {t.terms_14_title}</h2>
            <p>{t.terms_14_text}</p>
          </div>

          <div>
            <h2>15. {t.terms_15_title}</h2>
            <p>{t.terms_15_text}</p>
          </div>

          <div>
            <h2>16. {t.terms_16_title}</h2>
            <p>{t.terms_16_text}</p>
          </div>

          <div>
            <h2>17. {t.terms_17_title}</h2>
            <p>{t.terms_17_text}</p>
          </div>

          <div>
            <h2>18. {t.terms_18_title}</h2>
            <p>{t.terms_18_text}</p>
          </div>

          <div>
            <h2>19. {t.terms_19_title}</h2>
            <p>{t.terms_19_text}</p>
          </div>

          <div>
            <h2>20. {t.terms_20_title}</h2>
            <p>{t.terms_20_text}</p>
          </div>

          <div>
            <h2>21. {t.terms_21_title}</h2>
            <p>{t.terms_21_text}</p>
          </div>

          <div>
            <h2>22. {t.terms_22_title}</h2>
            <p>{t.terms_22_text_1}</p>
            <p>{t.terms_22_text_2}</p>
          </div>

          <div>
            <h2>23. {t.terms_23_title}</h2>
            <p>{t.terms_23_text}</p>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
