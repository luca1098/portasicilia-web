import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getArticles } from '@/lib/api/blog'
import ArticleCard from '@/components/blog/article-card'
import { NewspaperIcon } from '@/lib/constants/icons'

export default async function BlogPage({ params }: PageParamsProps) {
  const { lang } = await params
  const [t, result] = await Promise.all([getTranslations(lang as SupportedLocale), getArticles()])

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t.blog_title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{t.blog_subtitle}</p>
      </div>

      {result.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted/60">
            <NewspaperIcon className="size-7 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground">{t.blog_no_articles}</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {result.data.map(article => (
            <ArticleCard key={article.id} article={article} lang={lang} readMoreLabel={t.blog_read_more} />
          ))}
        </div>
      )}
    </section>
  )
}
