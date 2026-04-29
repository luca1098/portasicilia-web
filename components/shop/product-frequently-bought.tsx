import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'
import type { Product } from '@/lib/schemas/entities/product.entity.schema'
import ProductCard from './product-card'

type ProductFrequentlyBoughtProps = {
  products: Product[]
  lang: string
}

export default async function ProductFrequentlyBought({ products, lang }: ProductFrequentlyBoughtProps) {
  if (products.length === 0) return null

  const t = await getTranslations(lang as SupportedLocale)

  return (
    <section className="border-t border-gray-100 px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-xl font-bold text-gray-900">{t.shop_product_frequently_bought}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {products.map(product => (
            <div key={product.id} className="w-44 shrink-0 md:w-52">
              <ProductCard product={product} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
