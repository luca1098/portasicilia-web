'use client'

import { useState } from 'react'
import type { Product, ShopCategory } from '@/lib/schemas/entities/product.entity.schema'
import { useTranslation } from '@/lib/context/translation.context'
import { PackageIcon } from '@/lib/constants/icons'
import ProductCard from './product-card'
import ShopCategoryBar from './shop-category-bar'

type ProductGridProps = {
  products: Product[]
  categories: ShopCategory[]
  lang: string
}

export default function ProductGrid({ products, categories, lang }: ProductGridProps) {
  const t = useTranslation()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const showCategoryBar = categories.length > 1

  return (
    <div id="products" className="flex flex-col gap-8">
      {showCategoryBar && (
        <ShopCategoryBar
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      )}

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 py-20 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted">
            <PackageIcon className="size-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">{t.shop_product_no_products}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} lang={lang} />
          ))}
        </div>
      )}
    </div>
  )
}
