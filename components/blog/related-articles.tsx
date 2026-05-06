import type { Article } from '@/lib/schemas/entities/article.entity.schema'
import ArticleCard from './article-card'

type RelatedArticlesProps = {
  articles: Article[]
  lang: string
  title: string
  readMoreLabel: string
}

export default function RelatedArticles({ articles, lang, title, readMoreLabel }: RelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="mb-8 text-2xl font-bold">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} lang={lang} readMoreLabel={readMoreLabel} />
        ))}
      </div>
    </section>
  )
}
