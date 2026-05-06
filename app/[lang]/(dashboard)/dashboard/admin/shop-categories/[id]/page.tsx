import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { getShopCategoryById } from '@/lib/api/products'
import ShopCategoryEditForm from '@/components/dashboard/shop-categories/shop-category-edit-form'
import AdminDetailHeader from '@/components/dashboard/admin-detail-header'

type EditShopCategoryPageProps = {
  params: Promise<{ lang: string; id: string }>
}

export default async function EditShopCategoryPage({ params }: EditShopCategoryPageProps) {
  const { lang, id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)

  let category
  try {
    category = await getShopCategoryById(id)
  } catch {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <AdminDetailHeader
        backHref={`/${lang}/dashboard/admin/shop-categories`}
        title={t.admin_shop_cat_edit}
      />

      <ShopCategoryEditForm category={category} />
    </div>
  )
}
