import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getShopCategoriesAdmin } from '@/lib/api/products'
import ShopCategoriesTable from '@/components/dashboard/shop-categories/shop-categories-table'
import AdminListHeader from '@/components/dashboard/admin-list-header'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusIcon } from '@/lib/constants/icons'

export default async function ShopCategoriesPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }
  const categories = await getShopCategoriesAdmin(headers)

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <AdminListHeader title={t.admin_shop_categories_title} subtitle={t.admin_shop_categories_subtitle}>
        <Button asChild size="default" className="shrink-0">
          <Link href={`/${lang}/dashboard/admin/shop-categories/new`}>
            <PlusIcon className="size-4" />
            {t.admin_shop_cat_add}
          </Link>
        </Button>
      </AdminListHeader>

      <ShopCategoriesTable categories={categories} />
    </div>
  )
}
