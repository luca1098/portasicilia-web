import { authOptions } from '@/lib/auth/auth-options'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import AdminDetailHeader from '@/components/dashboard/admin-detail-header'
import AdminProductReviewCreateForm from '@/components/dashboard/admin/admin-product-review-create-form'
import { DashboardFormPage } from '@/components/dashboard/dashboard-page'

export default async function NewAdminShopReviewPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)

  return (
    <DashboardFormPage>
      <AdminDetailHeader
        backHref={`/${lang}/dashboard/admin/shop-reviews`}
        title={t.admin_product_review_create_title}
      >
        <p className="mt-1 text-sm text-muted-foreground">{t.admin_product_review_create_subtitle}</p>
      </AdminDetailHeader>

      <div className="rounded-xl border border-border bg-card p-6">
        <AdminProductReviewCreateForm />
      </div>
    </DashboardFormPage>
  )
}
