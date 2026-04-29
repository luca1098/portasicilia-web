'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { StarIcon } from '@/lib/constants/icons'
import type { FavoriteProductItem } from '@/lib/api/favorite.api'
import { formatCurrency } from '@/core/utils/currency.utils'

type WishlistProductItemProps = {
  item: FavoriteProductItem
}

export default function WishlistProductItem({ item }: WishlistProductItemProps) {
  const { lang } = useParams()
  const { product } = item

  const href = `/${lang}/shop/${product.slug}`

  const firstVariant = product.variants[0]
  const priceLabel = firstVariant ? formatCurrency(Number(firstVariant.price)) : null

  const avgRating =
    product.reviews.length > 0
      ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
      : null

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border bg-background p-3 transition-colors hover:bg-muted/50"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
        {product.cover && (
          <Image src={product.cover} alt={product.name} fill className="object-cover" sizes="56px" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</p>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <StarIcon className="size-3 fill-foreground text-foreground" />
            <span className="text-xs">{avgRating ?? '—'}</span>
          </div>
          {priceLabel && <p className="shrink-0 text-xs text-muted-foreground">{priceLabel}</p>}
        </div>
      </div>
    </Link>
  )
}
