import type { Metadata } from 'next'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { SupportedLocale } from '@/lib/configs/locales'
import ApplicationWizard from '@/components/partner/application-wizard'

export async function generateMetadata({ params }: PageParamsProps): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)
  return { title: t.partner_form_title }
}

export default async function PartnerApplicationPage({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold">{t.partner_form_title}</h1>
        <p className="mt-2 text-muted-foreground">{t.partner_form_subtitle}</p>
      </div>
      <div className="mt-10">
        <ApplicationWizard lang={lang as 'it' | 'en'} />
      </div>
    </main>
  )
}
