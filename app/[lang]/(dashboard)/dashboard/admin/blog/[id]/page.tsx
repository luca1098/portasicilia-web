import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { getArticleById, getAuthorsAdmin } from '@/lib/api/blog'
import { getCategoriesAdmin } from '@/lib/api/categories'
import { getLocalities } from '@/lib/api/localities'
import ArticleForm from '@/components/dashboard/blog/article-form'
import { DashboardFormPage } from '@/components/dashboard/dashboard-page'
import Link from 'next/link'
import { ArrowLeft } from '@/lib/constants/icons'

type EditArticlePageProps = {
  params: Promise<{ lang: string; id: string }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { lang, id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }

  let article
  try {
    article = await getArticleById(id, headers)
  } catch {
    notFound()
  }

  const [authors, categories, localities] = await Promise.all([
    getAuthorsAdmin(headers),
    getCategoriesAdmin(headers),
    getLocalities(),
  ])

  return (
    <DashboardFormPage>
      <div className="flex items-center gap-4">
        <Link
          href={`/${lang}/dashboard/admin/blog`}
          className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.admin_article_edit}</h1>
        </div>
      </div>

      <ArticleForm
        mode="edit"
        article={article}
        authors={authors}
        categories={categories}
        localities={localities}
      />
    </DashboardFormPage>
  )
}
