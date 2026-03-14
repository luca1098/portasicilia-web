import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getCategories } from '@/lib/api/categories'
import CategoriesTable from '@/components/dashboard/categories/categories-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusIcon } from '@/lib/constants/icons'

export default async function CategoriesSettingsPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const categories = await getCategories()

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.admin_categories_title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{t.admin_categories_subtitle}</p>
        </div>
        <Button asChild size="default" className="shrink-0">
          <Link href={`/${lang}/dashboard/admin/categories/new`}>
            <PlusIcon className="size-4" />
            {t.admin_cat_add}
          </Link>
        </Button>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  )
}
