import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps, PageSearchParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getAdminBookings } from '@/lib/api/bookings'
import RequestsTable from '@/components/dashboard/bookings/requests-table'

const ALL_STATUSES = 'PENDING_APPROVAL,REJECTED,COUNTER_PROPOSED,CANCELLED,NO_SHOW'

export default async function RequestsPage({
  params,
  searchParams,
}: PageParamsProps & PageSearchParamsProps) {
  const { lang } = await params
  const sp = await searchParams
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }

  const statusFilter = sp.status
  const fetchParams = statusFilter
    ? { status: statusFilter, limit: 20 }
    : { statusIn: ALL_STATUSES, limit: 20 }

  const result = await getAdminBookings(headers, fetchParams)

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="rounded-2xl bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.admin_requests_title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
          {t.admin_requests_filter_subtitle}
        </p>
      </div>

      <RequestsTable
        bookings={result.data}
        initialNextCursor={result.nextCursor}
        fetchParams={fetchParams}
        activeStatus={statusFilter || 'ALL'}
      />
    </div>
  )
}
