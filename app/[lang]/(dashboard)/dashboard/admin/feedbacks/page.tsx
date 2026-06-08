import { authOptions } from '@/lib/auth/auth-options'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import {
  getCheckoutFeedbacks,
  getCheckoutFeedbackStats,
  type CheckoutFeedback,
  type CheckoutFeedbackStats,
} from '@/lib/api/checkout-feedback'
import AdminFeedbacksContent from '@/components/dashboard/admin/admin-feedbacks-content'
import { DashboardListPage } from '@/components/dashboard/dashboard-page'

export default async function AdminFeedbacksPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }

  let feedbacks = { data: [] as CheckoutFeedback[], nextCursor: null as string | null }
  let stats: CheckoutFeedbackStats = { total: 0, averageRating: 0, byRating: {} }
  try {
    ;[feedbacks, stats] = await Promise.all([
      getCheckoutFeedbacks(headers, { limit: 20 }),
      getCheckoutFeedbackStats(headers),
    ])
  } catch {
    // Endpoint may not be available yet; show empty state
  }

  return (
    <DashboardListPage>
      <div className="rounded-2xl bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.admin_feedbacks_title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{t.admin_feedbacks_subtitle}</p>
      </div>

      <AdminFeedbacksContent
        initialFeedbacks={feedbacks.data}
        initialNextCursor={feedbacks.nextCursor}
        stats={stats}
      />
    </DashboardListPage>
  )
}
