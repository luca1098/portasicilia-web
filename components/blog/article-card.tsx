import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@/lib/schemas/entities/article.entity.schema'

type ArticleCardProps = {
  article: Article
  lang: string
  readMoreLabel: string
}

export default function ArticleCard({ article, lang, readMoreLabel }: ArticleCardProps) {
  return (
    <Link
      href={`/${lang}/blog/${article.slug}`}
      className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {article.cover ? (
          <Image
            src={article.cover}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="text-4xl text-muted-foreground/30">PS</span>
          </div>
        )}
        {article.category && (
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {article.category.name}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{article.author?.name}</span>
          <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}</span>
        </div>
        <p className="mt-3 text-xs font-medium text-primary">{readMoreLabel}</p>
      </div>
    </Link>
  )
}
