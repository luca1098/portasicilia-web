import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getExperiencesAdmin } from '@/lib/api/experiences'
import ExperiencesTable from '@/components/dashboard/experiences/experiences-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusIcon } from '@/lib/constants/icons'

export default async function ExperiencesSettingsPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }
  const result = await getExperiencesAdmin(headers)

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.admin_experiences_title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.admin_experiences_subtitle}</p>
        </div>
        <Button asChild size="default">
          <Link href={`/${lang}/dashboard/admin/experiences/new`}>
            <PlusIcon className="size-4" />
            {t.admin_exp_add}
          </Link>
        </Button>
      </div>

      <ExperiencesTable experiences={result.data} />
    </div>
  )
}
