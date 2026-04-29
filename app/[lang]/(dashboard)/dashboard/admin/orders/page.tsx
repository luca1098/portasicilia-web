import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getAdminOrders } from '@/lib/api/orders'
import OrdersTable from '@/components/dashboard/orders/orders-table'

export default async function OrdersAdminPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }
  const fetchParams = { limit: 20 }
  const result = await getAdminOrders(headers, fetchParams)

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="rounded-2xl bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.admin_orders_title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{t.admin_orders_subtitle}</p>
      </div>

      <OrdersTable
        initialOrders={result.data}
        initialNextCursor={result.nextCursor}
        fetchParams={fetchParams}
      />
    </div>
  )
}
