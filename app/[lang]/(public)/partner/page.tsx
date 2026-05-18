import type { Metadata } from 'next'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { SupportedLocale } from '@/lib/configs/locales'
import { buildMetadata } from '@/lib/seo/metadata'
import PartnerHero from '@/components/partner/partner-hero'
import PartnerHowItWorks from '@/components/partner/partner-how-it-works'
import PartnerWhoWeLookFor from '@/components/partner/partner-who-we-look-for'
import PartnerTestimonials from '@/components/partner/partner-testimonials'
import PartnerFaq from '@/components/partner/partner-faq'
import PartnerFinalCta from '@/components/partner/partner-final-cta'

export async function generateMetadata({ params }: PageParamsProps): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)
  return buildMetadata({
    title: t.partner_seo_title,
    description: t.partner_seo_description,
    path: 'partner',
    locale: lang,
  })
}

export default async function PartnerPage({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  return (
    <main>
      <PartnerHero t={t} lang={lang} />
      <PartnerHowItWorks t={t} />
      <PartnerWhoWeLookFor t={t} />
      <PartnerTestimonials t={t} />
      <PartnerFaq t={t} />
      <PartnerFinalCta t={t} lang={lang} />
    </main>
  )
}
