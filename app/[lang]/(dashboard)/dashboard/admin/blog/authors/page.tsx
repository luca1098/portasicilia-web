import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getAuthorsAdmin } from '@/lib/api/blog'
import AuthorsTable from '@/components/dashboard/blog/authors-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusIcon } from '@/lib/constants/icons'

export default async function BlogAuthorsPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }
  const authors = await getAuthorsAdmin(headers)

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.admin_authors_title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{t.admin_authors_subtitle}</p>
        </div>
        <Button asChild size="default" className="shrink-0">
          <Link href={`/${lang}/dashboard/admin/blog/authors/new`}>
            <PlusIcon className="size-4" />
            {t.admin_authors_add}
          </Link>
        </Button>
      </div>

      <AuthorsTable authors={authors} />
    </div>
  )
}
