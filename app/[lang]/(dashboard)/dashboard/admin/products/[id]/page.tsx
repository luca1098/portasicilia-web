import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { getProductById, getShopCategoriesAdmin } from '@/lib/api/products'
import ProductEditForm from '@/components/dashboard/products/product-edit-form'
import AdminDetailHeader from '@/components/dashboard/admin-detail-header'
import { DashboardFormPage } from '@/components/dashboard/dashboard-page'

type EditProductPageProps = {
  params: Promise<{ lang: string; id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { lang, id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const headers = { Authorization: `Bearer ${session.accessToken}` }

  let product
  try {
    product = await getProductById(id)
  } catch {
    notFound()
  }

  const shopCategories = await getShopCategoriesAdmin(headers)

  return (
    <DashboardFormPage>
      <AdminDetailHeader backHref={`/${lang}/dashboard/admin/products`} title={product.name} />

      <ProductEditForm product={product} shopCategories={shopCategories} />
    </DashboardFormPage>
  )
}
