import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { getAuthorsAdmin } from '@/lib/api/blog'
import AuthorForm from '@/components/dashboard/blog/author-form'
import { DashboardFormPage } from '@/components/dashboard/dashboard-page'
import Link from 'next/link'
import { ArrowLeft } from '@/lib/constants/icons'

type EditAuthorPageProps = {
  params: Promise<{ lang: string; id: string }>
}

export default async function EditAuthorPage({ params }: EditAuthorPageProps) {
  const { lang, id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }

  const authors = await getAuthorsAdmin(headers)
  const author = authors.find(a => a.id === id)

  if (!author) {
    notFound()
  }

  return (
    <DashboardFormPage>
      <div className="flex items-center gap-4">
        <Link
          href={`/${lang}/dashboard/admin/blog/authors`}
          className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.admin_author_edit}</h1>
        </div>
      </div>

      <AuthorForm mode="edit" author={author} />
    </DashboardFormPage>
  )
}
