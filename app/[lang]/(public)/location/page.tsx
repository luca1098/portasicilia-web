import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { SupportedLocale } from '@/lib/configs/locales'
import { mockLocations } from '@/lib/constants/locations'
import LocationList from '@/components/location/location-list'

export default async function LocationPage({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">{t.location_page_title}</h1>
      <LocationList locations={mockLocations} lang={lang} subtitle={t.location_activities_subtitle} />
    </main>
  )
}
