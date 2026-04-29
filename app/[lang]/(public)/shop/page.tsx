import type { Metadata } from 'next'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { buildMetadata } from '@/lib/seo/metadata'
import { getProducts, getShopCategories } from '@/lib/api/products'
import type { Product, ShopCategory } from '@/lib/schemas/entities/product.entity.schema'
import PageWrapper from '@/components/layout/page-wrapper'
import ShopHero from '@/components/shop/shop-hero'
import ProductGrid from '@/components/shop/product-grid'
import TrustBadges from '@/components/shop/trust-badges'

export async function generateMetadata({ params }: PageParamsProps): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)
  return buildMetadata({
    title: t.shop_hero_title,
    description: t.shop_hero_subtitle,
    path: 'shop',
    locale: lang,
  })
}

export default async function ShopPage({ params }: PageParamsProps) {
  const { lang } = await params

  const [products, categories] = await Promise.all([
    getProducts().catch((): Product[] => []),
    getShopCategories().catch((): ShopCategory[] => []),
  ])

  return (
    <PageWrapper>
      <ShopHero lang={lang} />

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <ProductGrid products={products} categories={categories} lang={lang} />
      </section>

      <TrustBadges lang={lang} />
    </PageWrapper>
  )
}
