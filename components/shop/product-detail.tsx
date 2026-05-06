'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import type { Product } from '@/lib/schemas/entities/product.entity.schema'
import { useTranslation } from '@/lib/context/translation.context'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { ShoppingCartIcon } from '@/lib/constants/icons'
import ProductDescription from './product-description'
import ProductReviews from './product-reviews'
import { ProductPurchase } from './product-purchase-panel'

type ProductDetailProps = {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const t = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const allImages = useMemo(() => {
    const gallery = [...product.images].sort((a, b) => a.order - b.order).map(img => img.url)
    if (product.cover) return [product.cover, ...gallery]
    return gallery
  }, [product.cover, product.images])

  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedImage = allImages[selectedIndex] ?? null

  return (
    <ProductPurchase.Provider product={product}>
      <div className="mx-auto max-w-7xl px-4 py-12 pb-28 md:px-8 md:pb-12">
        <div className="grid items-start gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Left: Image + full description */}
          <div className="flex flex-col gap-10 lg:col-span-2">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  unoptimized
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-linear-to-br from-amber-50 to-orange-100">
                  <div className="size-24 rounded-full bg-amber-200/60" />
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setSelectedIndex(i)}
                    className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:size-20 ${
                      i === selectedIndex
                        ? 'border-primary'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}

            {product.description && <ProductDescription description={product.description} />}

            <div className="border-t pt-8">
              <ProductReviews reviews={product.reviews ?? []} />
            </div>
          </div>

          {/* Right: Info (desktop only) */}
          <div className="hidden md:sticky md:top-24 md:block md:self-start">
            <ProductPurchase.FullPanel />
          </div>
        </div>

        {/* Mobile bottom bar */}
        <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background px-4 py-3 md:hidden">
          <div className="flex items-center justify-between gap-4">
            <ProductPurchase.CompactPrice />
            <Button size="default" onClick={() => setMobileOpen(true)} className="gap-2">
              <ShoppingCartIcon className="size-4" />
              {t.shop_product_add_to_cart}
            </Button>
          </div>
        </div>

        <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader className="sr-only">
              <DrawerTitle>{product.name}</DrawerTitle>
              <DrawerDescription>{t.shop_product_add_to_cart}</DrawerDescription>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-6">
              <ProductPurchase.FullPanel />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </ProductPurchase.Provider>
  )
}
