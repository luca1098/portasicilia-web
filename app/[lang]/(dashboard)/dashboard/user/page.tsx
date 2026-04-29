import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { interpolate } from '@/lib/utils/i18n.utils'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getUserBookings } from '@/lib/api/user-bookings'
import { getUserOrders } from '@/lib/api/user-orders'
import UserBookingsProvider from '@/components/dashboard/user/user-bookings-provider'
import UserDashboardContent from '@/components/dashboard/user/user-dashboard-content'
import type { UserBooking } from '@/lib/api/user-bookings'
import type { UserOrder } from '@/lib/api/user-orders'

export default async function UserDashboardPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const name = session.user.firstName || session.user.email
  const headers = { Authorization: `Bearer ${session.accessToken}` }

  const [bookings, orders] = await Promise.all([
    getUserBookings(headers).catch((): UserBooking[] => []),
    getUserOrders(headers).catch((): UserOrder[] => []),
  ])

  return (
    <UserBookingsProvider initialBookings={bookings} initialOrders={orders}>
      <UserDashboardContent
        title={t.dashboard_user_title}
        welcome={interpolate(t.dashboard_welcome, { name })}
      />
    </UserBookingsProvider>
  )
}
