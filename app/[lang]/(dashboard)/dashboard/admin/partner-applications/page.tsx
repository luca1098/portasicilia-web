import { authOptions } from '@/lib/auth/auth-options'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { DashboardListPage } from '@/components/dashboard/dashboard-page'
import AdminApplicationsList from '@/components/partner/admin-applications-list'
import { getAdminPartnerApplications } from '@/lib/api/partner-applications'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const PAGE_SIZE = 20

export default async function AdminPartnerApplicationsPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }
  const initialData = await getAdminPartnerApplications({ page: 1, pageSize: PAGE_SIZE }, headers)

  return (
    <DashboardListPage>
      <div className="flex flex-col gap-4 rounded-2xl bg-linear-to-br from-primary/8 via-primary/5 to-transparent p-6 sm:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.partner_admin_list_title}</h1>
        </div>
      </div>

      <AdminApplicationsList lang={lang} initialData={initialData} />
    </DashboardListPage>
  )
}
