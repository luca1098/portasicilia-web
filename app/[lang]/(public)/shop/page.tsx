import type { Metadata } from 'next'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { buildMetadata } from '@/lib/seo/metadata'
import { getProducts, getShopCategories } from '@/lib/api/products'
import { getExperienceCards, type ExperienceCard } from '@/lib/api/experiences'
import type { Product, ShopCategory } from '@/lib/schemas/entities/product.entity.schema'
import ShopHero from '@/components/shop/shop-hero'
import ProductGrid from '@/components/shop/product-grid'
import ShopExperiencesCrossSell from '@/components/shop/shop-experiences-cross-sell'

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

  const [products, categories, experiencesPage] = await Promise.all([
    getProducts(undefined, lang).catch((): Product[] => []),
    getShopCategories().catch((): ShopCategory[] => []),
    getExperienceCards({ highlighted: true, limit: 4 }).catch(() => ({
      data: [] as ExperienceCard[],
      nextCursor: null,
    })),
  ])

  const featuredCategory = categories.length === 1 ? categories[0] : null

  return (
    <>
      <ShopHero lang={lang} category={featuredCategory} />

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <ProductGrid products={products} categories={categories} lang={lang} />
      </section>
      <ShopExperiencesCrossSell lang={lang} experiences={experiencesPage.data} />
    </>
  )
}
