import { authOptions } from '@/lib/auth/auth-options'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { interpolate } from '@/lib/utils/i18n.utils'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getAdminStats } from '@/lib/api/bookings'
import AdminDashboardContent from '@/components/dashboard/admin-dashboard-content'

export default async function AdminDashboardPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const name = session.user.firstName || session.user.email
  const headers = { Authorization: `Bearer ${session.accessToken}` }

  let statsValues = { locations: '—', experiences: '—', stays: '—', users: '—' }
  try {
    const data = await getAdminStats(headers)
    statsValues = {
      locations: String(data.locations),
      experiences: String(data.experiences),
      stays: String(data.stays),
      users: String(data.users),
    }
  } catch {
    // Stats endpoint may not be available yet; show placeholders
  }

  return (
    <AdminDashboardContent
      title={t.dashboard_admin_title}
      welcome={interpolate(t.dashboard_welcome, { name })}
      stats={{
        locations: t.admin_stats_locations,
        experiences: t.admin_stats_experiences,
        stays: t.admin_stats_stays,
        users: t.admin_stats_users,
      }}
      values={statsValues}
    />
  )
}
