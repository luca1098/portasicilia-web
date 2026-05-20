import { authOptions } from '@/lib/auth/auth-options'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getOwnerBookings } from '@/lib/api/owner-bookings'
import OwnerBookingsTable from '@/components/dashboard/owner/owner-bookings-table'
import { DashboardListPage } from '@/components/dashboard/dashboard-page'

export default async function OwnerBookingsPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }
  const fetchParams = { statusIn: 'CONFIRMED,CANCELLED,COMPLETED', limit: 20 }
  const result = await getOwnerBookings(headers, fetchParams)

  return (
    <DashboardListPage>
      <div className="rounded-2xl bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.owner_bookings_title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{t.owner_bookings_subtitle}</p>
      </div>

      <OwnerBookingsTable
        initialBookings={result.data}
        initialNextCursor={result.nextCursor}
        fetchParams={fetchParams}
      />
    </DashboardListPage>
  )
}
