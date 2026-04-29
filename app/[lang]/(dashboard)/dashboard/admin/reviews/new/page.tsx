import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import AdminDetailHeader from '@/components/dashboard/admin-detail-header'
import AdminReviewCreateForm from '@/components/dashboard/admin/admin-review-create-form'

export default async function NewAdminReviewPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <AdminDetailHeader backHref={`/${lang}/dashboard/admin/reviews`} title={t.admin_review_create_title}>
        <p className="mt-1 text-sm text-muted-foreground">{t.admin_review_create_subtitle}</p>
      </AdminDetailHeader>

      <div className="rounded-xl border border-border bg-card p-6">
        <AdminReviewCreateForm />
      </div>
    </div>
  )
}
