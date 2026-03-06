import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps, PageSearchParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getOwnerBookings } from '@/lib/api/owner-bookings'
import OwnerRequestsTable from '@/components/dashboard/owner/owner-requests-table'

const ALL_STATUSES = 'PENDING_APPROVAL,REJECTED,COUNTER_PROPOSED'

export default async function OwnerRequestsPage({
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

  const result = await getOwnerBookings(headers, fetchParams)

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.owner_requests_title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.owner_requests_subtitle}</p>
      </div>

      <OwnerRequestsTable
        bookings={result.data}
        initialNextCursor={result.nextCursor}
        fetchParams={fetchParams}
        activeStatus={statusFilter || 'ALL'}
      />
    </div>
  )
}
