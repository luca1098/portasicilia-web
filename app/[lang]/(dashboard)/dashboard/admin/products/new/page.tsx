import { authOptions } from '@/lib/auth/auth-options'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getShopCategoriesAdmin } from '@/lib/api/products'
import ProductCreateForm from '@/components/dashboard/products/product-create-form'
import AdminDetailHeader from '@/components/dashboard/admin-detail-header'
import { DashboardFormPage } from '@/components/dashboard/dashboard-page'

export default async function NewProductPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }
  const shopCategories = await getShopCategoriesAdmin(headers)

  return (
    <DashboardFormPage>
      <AdminDetailHeader backHref={`/${lang}/dashboard/admin/products`} title={t.admin_product_add} />

      <ProductCreateForm shopCategories={shopCategories} />
    </DashboardFormPage>
  )
}
