'use client'

import Image from 'next/image'
import type { ShopCategory } from '@/lib/schemas/entities/product.entity.schema'
import { useTranslation } from '@/lib/context/translation.context'
import { cn } from '@/lib/utils/shadcn.utils'

type ShopCategoryBarProps = {
  categories: ShopCategory[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export default function ShopCategoryBar({ categories, selectedId, onSelect }: ShopCategoryBarProps) {
  const t = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-900">{t.shop_categories_title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {/* All categories pill */}
        <button
          onClick={() => onSelect(null)}
          className={cn(
            'flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
            selectedId === null
              ? 'border-primary bg-primary text-white shadow-sm'
              : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40 hover:bg-primary/5'
          )}
        >
          {t.shop_product_all_categories}
        </button>

        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
              selectedId === category.id
                ? 'border-primary bg-primary text-white shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40 hover:bg-primary/5'
            )}
          >
            {category.cover && (
              <div className="relative size-5 overflow-hidden rounded-full">
                <Image
                  src={category.cover}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="20px"
                  unoptimized
                />
              </div>
            )}
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}
