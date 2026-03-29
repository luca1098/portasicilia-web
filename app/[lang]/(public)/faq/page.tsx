import type { Metadata } from 'next'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { buildMetadata } from '@/lib/seo/metadata'
import PageWrapper from '@/components/layout/page-wrapper'
import FaqContent from '@/components/faq/faq-content'
import JsonLd from '@/lib/seo/json-ld'
import { breadcrumbSchema, faqSchema } from '@/lib/seo/schema'
import { SITE_URL } from '@/lib/seo/constants'
import { FAQ_CATEGORIES } from '@/lib/constants/faq'

export async function generateMetadata({ params }: PageParamsProps): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)
  return buildMetadata({
    title: t.seo_faq_title,
    description: t.seo_faq_description,
    path: 'faq',
    locale: lang,
  })
}

export default async function FaqPage({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)
  const tr = (key: string) => (t as Record<string, string>)[key] ?? key

  const faqItems = FAQ_CATEGORIES.flatMap(category =>
    Array.from({ length: category.questionCount }, (_, i) => ({
      question: tr(`faq_${category.key}_${i + 1}_question`),
      answer: tr(`faq_${category.key}_${i + 1}_answer`),
    }))
  )

  return (
    <PageWrapper>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', url: `${SITE_URL}/${lang}` },
            { name: t.faq_title, url: `${SITE_URL}/${lang}/faq` },
          ]),
          faqSchema(faqItems),
        ]}
      />
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-8">
        <h1 className="mb-10 text-4xl font-bold tracking-tight">{t.faq_title}</h1>
        <FaqContent />
      </section>
    </PageWrapper>
  )
}
