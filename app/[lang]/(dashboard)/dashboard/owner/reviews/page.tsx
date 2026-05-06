import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getOwnerReviews } from '@/lib/api/owner-reviews'
import OwnerReviewsContent from '@/components/dashboard/owner/owner-reviews-content'
import { DashboardListPage } from '@/components/dashboard/dashboard-page'

export default async function OwnerReviewsPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }

  let reviews = {
    data: [] as Awaited<ReturnType<typeof getOwnerReviews>>['data'],
    nextCursor: null as string | null,
  }
  try {
    reviews = await getOwnerReviews(headers, { limit: 20 })
  } catch {
    // Reviews endpoint may not be available yet; show empty state
  }

  return (
    <DashboardListPage>
      <div className="rounded-2xl bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.owner_reviews_title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{t.owner_reviews_subtitle}</p>
      </div>

      <OwnerReviewsContent initialReviews={reviews.data} initialNextCursor={reviews.nextCursor} />
    </DashboardListPage>
  )
}
