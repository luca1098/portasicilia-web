import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { SupportedLocale } from '@/lib/configs/locales'
import { mockStays } from '@/lib/constants/stays'
import StayGrid from '@/components/stay/stay-grid'

export default async function StaysPage({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  const categoryLabels = {
    conferma_immediata: t.experience_cat_conferma_immediata,
    specialita_culinaria: t.experience_cat_specialita_culinaria,
    adrenalina_pura: t.experience_cat_adrenalina_pura,
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">{t.stays_page_title}</h1>
      <StayGrid stays={mockStays} lang={lang} categoryLabels={categoryLabels} />
    </main>
  )
}
