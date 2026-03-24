import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { getArticleBySlug, getArticles } from '@/lib/api/blog'
import type { Article } from '@/lib/schemas/entities/article.entity.schema'
import { interpolate } from '@/lib/utils/i18n.utils'
import ArticleContent from '@/components/blog/article-content'
import ArticleAuthorInfo from '@/components/blog/article-author-info'
import ArticleShareActions from '@/components/blog/article-share-actions'
import RelatedArticles from '@/components/blog/related-articles'
import { ArrowLeft } from '@/lib/constants/icons'

type BlogArticlePageProps = {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const article = await getArticleBySlug(slug)
    return {
      title: article.title,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        ...(article.cover && { images: [{ url: article.cover }] }),
      },
    }
  } catch {
    return {}
  }
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { lang, slug } = await params

  const tPromise = getTranslations(lang as SupportedLocale)

  let article: Article
  try {
    article = await getArticleBySlug(slug)
  } catch {
    notFound()
  }

  const relatedPromise = article.categoryId
    ? getArticles({ categoryId: article.categoryId, limit: 4 })
    : article.localityId
      ? getArticles({ localityId: article.localityId, limit: 4 })
      : null

  const [t, relatedResult] = await Promise.all([tPromise, relatedPromise])

  const relatedArticles = relatedResult ? relatedResult.data.filter(a => a.id !== article.id).slice(0, 3) : []

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <Link
        href={`/${lang}/blog`}
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t.blog_title}
      </Link>

      {article.cover && (
        <div className="relative mb-8 aspect-[2/1] overflow-hidden rounded-2xl">
          <Image src={article.cover} alt={article.title} fill className="object-cover" priority unoptimized />
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        {article.category && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {article.category.name}
          </span>
        )}
        {article.locality && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{article.locality.name}</span>
        )}
        {article.publishedAt && <span>{new Date(article.publishedAt).toLocaleDateString()}</span>}
        {article.author && <span>{interpolate(t.blog_by_author, { author: article.author.name })}</span>}
      </div>

      <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{article.title}</h1>

      <ArticleContent content={article.content} />

      <div className="mt-12 border-t border-border pt-8">
        <ArticleShareActions title={article.title} />
      </div>

      {article.author && (
        <div className="mt-8">
          <ArticleAuthorInfo
            name={article.author.name}
            bio={article.author.bio}
            avatar={article.author.avatar}
          />
        </div>
      )}

      <RelatedArticles
        articles={relatedArticles}
        lang={lang}
        title={t.blog_related_articles}
        readMoreLabel={t.blog_read_more}
      />
    </article>
  )
}
