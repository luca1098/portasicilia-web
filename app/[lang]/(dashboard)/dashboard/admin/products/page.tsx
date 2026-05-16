import { authOptions } from '@/lib/auth/auth-options'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getProductsAdmin } from '@/lib/api/products'
import ProductsTable from '@/components/dashboard/products/products-table'
import AdminListHeader from '@/components/dashboard/admin-list-header'
import { DashboardListPage } from '@/components/dashboard/dashboard-page'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusIcon } from '@/lib/constants/icons'

export default async function ProductsAdminPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }
  const products = await getProductsAdmin(headers)

  return (
    <DashboardListPage>
      <AdminListHeader title={t.admin_products_title} subtitle={t.admin_products_subtitle}>
        <Button asChild size="default" className="shrink-0">
          <Link href={`/${lang}/dashboard/admin/products/new`}>
            <PlusIcon className="size-4" />
            {t.admin_product_add}
          </Link>
        </Button>
      </AdminListHeader>

      <ProductsTable products={products} />
    </DashboardListPage>
  )
}
