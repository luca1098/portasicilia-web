import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import ShopCategoryCreateForm from '@/components/dashboard/shop-categories/shop-category-create-form'
import AdminDetailHeader from '@/components/dashboard/admin-detail-header'

export default async function NewShopCategoryPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <AdminDetailHeader backHref={`/${lang}/dashboard/admin/shop-categories`} title={t.admin_shop_cat_add} />

      <ShopCategoryCreateForm />
    </div>
  )
}
