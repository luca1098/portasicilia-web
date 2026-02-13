import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { SupportedLocale } from '@/lib/configs/locales'
import { getLocalityCards } from '@/lib/api/localities'
import LocationCardGrid from '@/components/location/location-card-grid'

export default async function LocationPage({ params }: PageParamsProps) {
  const { lang } = await params
  const [t, { data: locationCards }] = await Promise.all([
    getTranslations(lang as SupportedLocale),
    getLocalityCards(),
  ])

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold">{t.location_page_title}</h1>
        <p className="text-sm text-muted-foreground">{t.location_page_subtitle}</p>
      </div>
      <LocationCardGrid locations={locationCards} lang={lang} />
    </main>
  )
}
