import { authOptions } from '@/lib/auth/auth-options'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { interpolate } from '@/lib/utils/i18n.utils'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getOwnerStats } from '@/lib/api/owner-bookings'
import OwnerDashboardContent from '@/components/dashboard/owner/owner-dashboard-content'

export default async function OwnerDashboardPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const name = session.user.firstName || session.user.email
  const headers = { Authorization: `Bearer ${session.accessToken}` }

  let stats = {
    year: 0,
    totalBookings: 0,
    confirmedCount: 0,
    pendingCount: 0,
    totalRevenue: '0',
    monthly: [] as { month: number; count: number; revenue: string }[],
  }
  try {
    stats = await getOwnerStats(headers)
  } catch {
    // Stats endpoint may not be available yet; show zeros
  }

  const formattedRevenue = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(stats.totalRevenue))

  return (
    <OwnerDashboardContent
      title={t.dashboard_owner_title}
      welcome={interpolate(t.dashboard_welcome, { name })}
      stats={{
        totalBookings: t.owner_stats_total_bookings,
        confirmedCount: t.owner_stats_confirmed,
        pendingCount: t.owner_stats_pending,
        totalRevenue: t.owner_stats_revenue,
      }}
      values={{
        totalBookings: String(stats.totalBookings),
        confirmedCount: String(stats.confirmedCount),
        pendingCount: String(stats.pendingCount),
        totalRevenue: formattedRevenue,
      }}
    />
  )
}
