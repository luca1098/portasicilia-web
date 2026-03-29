import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/*/dashboard/', '/*/checkout/', '/api/', '/*/review/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
