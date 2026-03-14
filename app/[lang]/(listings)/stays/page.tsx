import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps, PageSearchParamsProps } from '@/lib/types/page.type'
import { SupportedLocale } from '@/lib/configs/locales'
import { getStayCards } from '@/lib/api/stays'
import StayGrid from '@/components/stay/stay-grid'

export default async function StaysPage({ params, searchParams }: PageParamsProps & PageSearchParamsProps) {
  const { lang } = await params
  const { localityId } = await searchParams

  const [t, { data: stayCards }] = await Promise.all([
    getTranslations(lang as SupportedLocale),
    getStayCards({ localityId }),
  ])

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">{t.stays_page_title}</h1>
      <StayGrid stays={stayCards} lang={lang} />
    </main>
  )
}
