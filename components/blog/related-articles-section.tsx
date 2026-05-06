import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@/lib/schemas/entities/article.entity.schema'
import { ArrowRight } from '@/lib/constants/icons'

type RelatedArticlesSectionProps = {
  articles: Article[]
  lang: string
  title: string
  ctaLabel: string
}

export default function RelatedArticlesSection({
  articles,
  lang,
  title,
  ctaLabel,
}: RelatedArticlesSectionProps) {
  if (articles.length === 0) return null

  const [featured, ...sideArticles] = articles

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h2 className="mb-8 text-2xl font-bold md:text-3xl">{title}</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Featured article — left side */}
        <Link
          href={`/${lang}/blog/${featured.slug}`}
          className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            {featured.cover ? (
              <Image
                src={featured.cover}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-4xl text-muted-foreground/30">PS</span>
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="mb-2 text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
              {featured.title}
            </h3>
            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{featured.excerpt}</p>
            <p className="mt-3 text-xs font-medium text-primary">{ctaLabel}</p>
          </div>
        </Link>

        {/* Side articles — right column */}
        {sideArticles.length > 0 && (
          <div className="flex flex-col gap-4">
            {sideArticles.map(article => (
              <Link
                key={article.id}
                href={`/${lang}/blog/${article.slug}`}
                className="group flex gap-4 overflow-hidden rounded-2xl border border-border bg-card p-3 transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-xl">
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
                      <span className="text-lg text-muted-foreground/30">PS</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-tight transition-colors group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA button */}
      <div className="mt-8 flex justify-center">
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          {ctaLabel}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
