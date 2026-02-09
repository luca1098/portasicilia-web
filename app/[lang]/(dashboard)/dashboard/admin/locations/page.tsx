import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getLocalities } from '@/lib/api/localities'
import LocalitiesTable from '@/components/dashboard/localities/localities-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusIcon } from '@/lib/constants/icons'

export default async function LocationsSettingsPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const localities = await getLocalities()

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.admin_locations_title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.admin_locations_subtitle}</p>
        </div>
        <Button asChild size="default">
          <Link href={`/${lang}/dashboard/admin/locations/new`}>
            <PlusIcon className="size-4" />
            {t.admin_loc_add}
          </Link>
        </Button>
      </div>

      <LocalitiesTable localities={localities} />
    </div>
  )
}
