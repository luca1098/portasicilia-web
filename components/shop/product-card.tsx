'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import type { Product } from '@/lib/schemas/entities/product.entity.schema'
import { HeartIcon, ShoppingCartIcon, PackageIcon } from '@/lib/constants/icons'
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
  const producerName = product.owner
    ? [product.owner.firstName, product.owner.lastName].filter(Boolean).join(' ').trim() || null
    : null

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
      <Link href={`/${lang}/shop/${product.slug}`} className="group flex flex-col gap-3">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          {product.cover ? (
            <Image
              src={product.cover}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              unoptimized
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-secondary">
              <PackageIcon className="size-10 text-muted-foreground/40" />
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.highlighted && (
              <span className="rounded-full bg-foreground/85 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-background backdrop-blur-sm">
                ★
              </span>
            )}
            {discountPercent !== null && (
              <span className="rounded-full bg-destructive/95 px-2.5 py-0.5 text-[11px] font-semibold text-background">
                -{discountPercent}%
              </span>
            )}
          </div>

          <Button
            type="button"
            className="absolute right-2 top-2 rounded-full bg-background/70 text-foreground backdrop-blur-sm transition-colors hover:bg-background/90"
            onClick={handleFavoriteClick}
            aria-label="Save"
            size="icon"
            variant="ghost"
          >
            <HeartIcon
              className={cn('size-5 transition-colors', isFavorited && 'fill-destructive text-destructive')}
            />
          </Button>
        </div>

        <div className="flex flex-col gap-1.5 px-0.5">
          {producerName && (
            <p className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {producerName}
            </p>
          )}

          <p className="line-clamp-2 text-sm font-semibold leading-tight text-foreground">{product.name}</p>

          {firstVariant && (
            <div className="mt-1 flex items-end justify-between gap-2">
              <div className="flex flex-col">
                {compareAtPrice && compareAtPrice > price && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatCurrency(String(compareAtPrice))}
                  </span>
                )}
                <span className="text-base font-bold text-foreground">
                  {formatCurrency(String(price))}
                  {unit && <span className="ml-1 text-xs font-normal text-muted-foreground">/ {unit}</span>}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
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
