import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { getCategoryById } from '@/lib/api/categories'
import CategoryForm from '@/components/dashboard/categories/category-form'
import { DashboardFormPage } from '@/components/dashboard/dashboard-page'
import Link from 'next/link'
import { ArrowLeft } from '@/lib/constants/icons'

type EditCategoryPageProps = {
  params: Promise<{ lang: string; id: string }>
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { lang, id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)

  let category
  try {
    category = await getCategoryById(id)
  } catch {
    notFound()
  }

  return (
    <DashboardFormPage>
      <div className="flex items-center gap-4">
        <Link
          href={`/${lang}/dashboard/admin/categories`}
          className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.admin_cat_edit}</h1>
        </div>
      </div>

      <CategoryForm mode="edit" category={category} />
    </DashboardFormPage>
  )
}
