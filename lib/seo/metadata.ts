import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, SITE_LOCALE_MAP } from './constants'

type BuildMetadataOptions = {
  title: string
  description: string
  path: string
  locale: string
  image?: string
  noIndex?: boolean
  type?: 'website' | 'article'
  articleMeta?: {
    publishedTime?: string
    modifiedTime?: string
    authors?: string[]
    section?: string
  }
}

export function buildMetadata({
  title,
  description,
  path,
  locale,
  image,
  noIndex = false,
  type = 'website',
  articleMeta,
}: BuildMetadataOptions): Metadata {
  const ogLocale = SITE_LOCALE_MAP[locale as keyof typeof SITE_LOCALE_MAP] || SITE_LOCALE_MAP.it
  const canonicalPath = path ? `${locale}/${path}` : locale
  const canonicalUrl = `${SITE_URL}/${canonicalPath}`
  const ogImage = image || DEFAULT_OG_IMAGE

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        it: `${SITE_URL}/it${path ? `/${path}` : ''}`,
        en: `${SITE_URL}/en${path ? `/${path}` : ''}`,
        'x-default': `${SITE_URL}/it${path ? `/${path}` : ''}`,
      },
    },
    openGraph: {
      type,
      locale: ogLocale,
      siteName: SITE_NAME,
      title,
      description,
      url: canonicalUrl,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      ...(type === 'article' && articleMeta
        ? {
            publishedTime: articleMeta.publishedTime || undefined,
            modifiedTime: articleMeta.modifiedTime || undefined,
            authors: articleMeta.authors,
            section: articleMeta.section,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  }
}

export function buildListingMetadata(
  entity: { name: string; slug: string; description: string; cover: string | null },
  type: 'experiences' | 'stays',
  locale: string,
  titleSuffix: string
): Metadata {
  const description =
    entity.description.length > 155 ? entity.description.slice(0, 155) + '...' : entity.description

  return buildMetadata({
    title: `${entity.name} — ${titleSuffix}`,
    description,
    path: `${type}/${entity.slug}`,
    locale,
    image: entity.cover || undefined,
  })
}

export function buildArticleMetadata(
  article: {
    title: string
    slug: string
    excerpt: string
    cover: string | null
    publishedAt: string | null
    updatedAt: string
    author?: { name: string } | null
    category?: { name: string } | null
  },
  locale: string
): Metadata {
  return buildMetadata({
    title: article.title,
    description: article.excerpt.length > 155 ? article.excerpt.slice(0, 155) + '...' : article.excerpt,
    path: `blog/${article.slug}`,
    locale,
    image: article.cover || undefined,
    type: 'article',
    articleMeta: {
      publishedTime: article.publishedAt || undefined,
      modifiedTime: article.updatedAt,
      authors: article.author ? [article.author.name] : undefined,
      section: article.category?.name || undefined,
    },
  })
}
