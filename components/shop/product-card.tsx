'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import type { Product } from '@/lib/schemas/entities/product.entity.schema'
import { HeartIcon, ShoppingCartIcon } from '@/lib/constants/icons'
import { formatCurrency } from '@/lib/utils/format.utils'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/shadcn.utils'
import useFavoriteStore, { useFavoriteActions } from '@/core/store/favorite.store'
import { useCartActions } from '@/core/store/cart.store'
import LoginPopup from '@/components/auth/login-popup'

type ProductCardProps = {
  product: Product
  lang: string
}

function getDiscountPercent(price: number, compareAtPrice: number | null): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

export default function ProductCard({ product, lang }: ProductCardProps) {
  const [loginOpen, setLoginOpen] = useState(false)
  const { data: session } = useSession()
  const isFavorited = useFavoriteStore(state => state.productIds.includes(product.id))
  const { toggleProduct } = useFavoriteActions()
  const { addItem, open } = useCartActions()

  const firstVariant = product.variants[0] ?? null
  const price = Number(firstVariant?.price ?? 0)
  const compareAtPrice = firstVariant?.compareAtPrice ? Number(firstVariant.compareAtPrice) : null
  const discountPercent = getDiscountPercent(price, compareAtPrice)
  const unit = firstVariant ? `${Number(firstVariant.volume)} ${firstVariant.unitOfMeasurement}` : null

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!session?.user) {
      setLoginOpen(true)
      return
    }
    toggleProduct(product.id, session.accessToken)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!firstVariant) return
    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productCover: product.cover,
      variantId: firstVariant.id,
      variantVolume: Number(firstVariant.volume),
      variantUnit: firstVariant.unitOfMeasurement,
      price: Number(firstVariant.price),
      maxQuantity: firstVariant.maxQuantityPerOrder ?? 99,
      commissionType: firstVariant.commissionType ?? null,
      commissionValue: firstVariant.commissionValue == null ? null : Number(firstVariant.commissionValue),
    })
    open()
  }

  return (
    <>
      <Link href={`/${lang}/shop/${product.slug}`} className="group flex flex-col gap-2">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
          {product.cover ? (
            <Image
              src={product.cover}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              unoptimized
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
              <div className="size-12 rounded-full bg-amber-200/60" />
            </div>
          )}

          {/* Discount badge */}
          {discountPercent !== null && (
            <div className="absolute left-2 top-2">
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                -{discountPercent}%
              </span>
            </div>
          )}

          <Button
            type="button"
            className="absolute right-2 top-2 rounded-full p-1 text-white transition-colors hover:text-primary"
            onClick={handleFavoriteClick}
            aria-label="Save"
            size="icon"
            variant="ghost"
          >
            <HeartIcon className={cn('size-5', isFavorited && 'fill-red-500 text-red-500')} />
          </Button>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 px-0.5">
          <p className="line-clamp-2 text-sm font-medium text-gray-900 leading-tight">{product.name}</p>

          {firstVariant && (
            <div className="flex items-end justify-between gap-2">
              <div className="flex flex-col">
                {compareAtPrice && compareAtPrice > price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatCurrency(String(compareAtPrice))}
                  </span>
                )}
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(String(price))}
                  {unit && <span className="ml-0.5 text-xs font-normal text-gray-500"> / {unit}</span>}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-opacity hover:opacity-90"
                aria-label="Add to cart"
              >
                <ShoppingCartIcon className="size-5" />
              </button>
            </div>
          )}
        </div>
      </Link>

      {loginOpen && <LoginPopup onClose={() => setLoginOpen(false)} />}
    </>
  )
}
