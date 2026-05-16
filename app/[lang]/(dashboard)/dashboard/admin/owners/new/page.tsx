import { authOptions } from '@/lib/auth/auth-options'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { CreateOwnerForm } from '@/components/dashboard/owners/owner-form'
import { DashboardFormPage } from '@/components/dashboard/dashboard-page'
import Link from 'next/link'
import { ArrowLeft } from '@/lib/constants/icons'

export default async function NewAdminOwnerPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)

  return (
    <DashboardFormPage>
      <div className="flex items-center gap-4">
        <Link
          href={`/${lang}/dashboard/admin/owners`}
          className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.admin_owners_new_title}</h1>
        </div>
      </div>

      <CreateOwnerForm />
    </DashboardFormPage>
  )
}
