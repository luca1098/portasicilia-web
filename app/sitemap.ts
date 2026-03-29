import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/constants'
import { supportedLocales } from '@/lib/configs/locales'
import { getExperienceCards } from '@/lib/api/experiences'
import { getStayCards } from '@/lib/api/stays'
import { getLocalityCards } from '@/lib/api/localities'
import { getCategories } from '@/lib/api/categories'
import { getArticles } from '@/lib/api/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [experienceCards, stayCards, localityCards, categories, articles] = await Promise.all([
    getExperienceCards({ limit: 500 }).catch(() => ({ data: [] })),
    getStayCards({ limit: 500 }).catch(() => ({ data: [] })),
    getLocalityCards({ limit: 500 }).catch(() => ({ data: [] })),
    getCategories().catch(() => []),
    getArticles({ limit: 500 }).catch(() => ({ data: [] })),
  ])

  const locales = supportedLocales

  function localeAlternates(path: string) {
    const languages: Record<string, string> = {}
    for (const locale of locales) {
      languages[locale] = `${SITE_URL}/${locale}${path ? `/${path}` : ''}`
    }
    return { languages }
  }

  const entries: MetadataRoute.Sitemap = []

  // Static pages per locale
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: 'experiences', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: 'stays', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: 'location', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: 'categories', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: 'blog', priority: 0.7, changeFrequency: 'weekly' as const },
  ]

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${SITE_URL}/${locale}${page.path ? `/${page.path}` : ''}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: localeAlternates(page.path),
      })
    }
  }

  // Dynamic experience pages
  for (const exp of experienceCards.data) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/experiences/${exp.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: localeAlternates(`experiences/${exp.slug}`),
      })
    }
  }

  // Dynamic stay pages
  for (const stay of stayCards.data) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/stays/${stay.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: localeAlternates(`stays/${stay.slug}`),
      })
    }
  }

  // Dynamic location pages
  for (const loc of localityCards.data) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/location/${loc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: localeAlternates(`location/${loc.slug}`),
      })
    }
  }

  // Dynamic category pages
  for (const cat of categories) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: localeAlternates(`category/${cat.slug}`),
      })
    }
  }

  // Dynamic blog article pages
  for (const article of articles.data) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${article.slug}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: localeAlternates(`blog/${article.slug}`),
      })
    }
  }

  return entries
}
