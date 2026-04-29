'use client'

import { useState, useMemo } from 'react'
import type { Product } from '@/lib/schemas/entities/product.entity.schema'
import type { ShopCategory } from '@/lib/schemas/entities/product.entity.schema'
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

  const filtered = useMemo(() => {
    if (!selectedCategoryId) return products
    return products.filter(p => p.categoryId === selectedCategoryId)
  }, [products, selectedCategoryId])

  return (
    <div id="products" className="flex flex-col gap-8">
      {categories.length > 0 && (
        <ShopCategoryBar
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{t.shop_featured_title}</h2>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted/60">
              <PackageIcon className="size-7 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground">{t.shop_product_no_products}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
