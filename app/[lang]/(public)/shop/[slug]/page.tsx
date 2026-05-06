import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { buildMetadata } from '@/lib/seo/metadata'
import { getProductBySlug, getHighlightedProducts } from '@/lib/api/products'
import type { Product } from '@/lib/schemas/entities/product.entity.schema'
import PageWrapper from '@/components/layout/page-wrapper'
import ProductDetail from '@/components/shop/product-detail'
import ProductFrequentlyBought from '@/components/shop/product-frequently-bought'

type ProductDetailPageProps = PageParamsProps & {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { lang, slug } = await params
  const product = await getProductBySlug(slug, lang).catch(() => null)
  if (!product) {
    const t = await getTranslations(lang as SupportedLocale)
    return buildMetadata({
      title: t.shop_hero_title,
      description: t.shop_hero_subtitle,
      path: `shop/${slug}`,
      locale: lang,
    })
  }
  return buildMetadata({
    title: product.name,
    description: product.description ?? '',
    path: `shop/${slug}`,
    locale: lang,
  })
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { lang, slug } = await params

  const [product, highlightedProducts] = await Promise.all([
    getProductBySlug(slug, lang).catch((): null => null),
    getHighlightedProducts(lang).catch((): Product[] => []),
  ])

  if (!product) {
    notFound()
  }

  const relatedProducts = highlightedProducts.filter(p => p.id !== product.id).slice(0, 6)

  return (
    <PageWrapper>
      <ProductDetail product={product} />

      <ProductFrequentlyBought products={relatedProducts} lang={lang} />
    </PageWrapper>
  )
}
