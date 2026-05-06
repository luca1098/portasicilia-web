'use client'

import { createContext, use, useMemo, useState, type ReactNode } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import type { Product, ProductVariant } from '@/lib/schemas/entities/product.entity.schema'
import { useTranslation } from '@/lib/context/translation.context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HeartIcon, MinusIcon, PlusIcon, ShoppingCartIcon } from '@/lib/constants/icons'
import { cn } from '@/lib/utils/shadcn.utils'
import useFavoriteStore, { useFavoriteActions } from '@/core/store/favorite.store'
import { useCartActions } from '@/core/store/cart.store'
import LoginPopup from '@/components/auth/login-popup'
import ProductPrice from './product-price'

type ProductPurchaseContextValue = {
  product: Product
  selectedVariant: ProductVariant | undefined
  selectedVariantId: string
  quantity: number
  selectVariant: (variantId: string) => void
  increment: () => void
  decrement: () => void
}

const ProductPurchaseContext = createContext<ProductPurchaseContextValue | null>(null)

function useProductPurchase() {
  const ctx = use(ProductPurchaseContext)
  if (!ctx) throw new Error('ProductPurchase.* must be used within <ProductPurchase.Provider>')
  return ctx
}

function Provider({ product, children }: { product: Product; children: ReactNode }) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(product.variants[0]?.id ?? '')
  const [quantity, setQuantity] = useState(1)

  const selectedVariant = useMemo(
    () => product.variants.find(v => v.id === selectedVariantId),
    [product.variants, selectedVariantId]
  )

  const selectVariant = (variantId: string) => {
    setSelectedVariantId(variantId)
    setQuantity(1)
  }

  const increment = () => {
    const max = selectedVariant?.maxQuantityPerOrder ?? 99
    setQuantity(q => Math.min(max, q + 1))
  }

  const decrement = () => setQuantity(q => Math.max(1, q - 1))

  const value: ProductPurchaseContextValue = {
    product,
    selectedVariant,
    selectedVariantId,
    quantity,
    selectVariant,
    increment,
    decrement,
  }

  return <ProductPurchaseContext value={value}>{children}</ProductPurchaseContext>
}

function Header() {
  const { product } = useProductPurchase()
  const t = useTranslation()
  return (
    <div className="flex flex-col gap-2">
      {product.highlighted && (
        <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          {t.shop_product_best_seller}
        </span>
      )}
      <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{product.name}</h1>
      {product.shortDescription && (
        <p className="text-base leading-relaxed text-gray-500">{product.shortDescription}</p>
      )}
    </div>
  )
}

function CategoryTag() {
  const { product } = useProductPurchase()
  if (!product.category) return null
  return (
    <div className="flex">
      <Badge variant="outline" className="rounded-full text-xs">
        {product.category.name}
      </Badge>
    </div>
  )
}

function VariantSelector() {
  const { product, selectedVariantId, selectVariant } = useProductPurchase()
  const t = useTranslation()
  if (product.variants.length <= 1) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-gray-700">{t.shop_product_volume}</p>
      <div className="flex flex-wrap gap-2">
        {product.variants.map(variant => (
          <button
            key={variant.id}
            onClick={() => selectVariant(variant.id)}
            className={cn(
              'rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all',
              selectedVariantId === variant.id
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 text-gray-600 hover:border-primary/40'
            )}
          >
            {Number(variant.volume)} {variant.unitOfMeasurement}
          </button>
        ))}
      </div>
    </div>
  )
}

function Price() {
  const { selectedVariant } = useProductPurchase()
  if (!selectedVariant) return null
  return <ProductPrice variant={selectedVariant} size="lg" />
}

function CompactPrice() {
  const { selectedVariant } = useProductPurchase()
  if (!selectedVariant) return null
  return <ProductPrice variant={selectedVariant} size="sm" showUnit={false} />
}

function QuantityStepper() {
  const { quantity, increment, decrement } = useProductPurchase()
  const t = useTranslation()
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-gray-700">{t.shop_product_quantity}</p>
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 p-1">
        <button
          onClick={decrement}
          className="flex size-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
        >
          <MinusIcon className="size-4" />
        </button>
        <span className="min-w-8 text-center text-sm font-semibold">{quantity}</span>
        <button
          onClick={increment}
          className="flex size-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}

function WishlistButton() {
  const { product } = useProductPurchase()
  const { data: session } = useSession()
  const [loginOpen, setLoginOpen] = useState(false)
  const isFavorited = useFavoriteStore(state => state.productIds.includes(product.id))
  const { toggleProduct } = useFavoriteActions()

  const handleClick = () => {
    if (!session?.user) {
      setLoginOpen(true)
      return
    }
    toggleProduct(product.id, session.accessToken)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'mt-5 flex size-10 items-center justify-center rounded-xl border border-gray-200 transition-colors',
          isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
        )}
        aria-label="Add to wishlist"
      >
        <HeartIcon className={cn('size-5', isFavorited && 'fill-red-500')} />
      </button>
      {loginOpen && <LoginPopup onClose={() => setLoginOpen(false)} />}
    </>
  )
}

function buildCartItem(product: Product, variant: ProductVariant) {
  return {
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    productCover: product.cover,
    variantId: variant.id,
    variantVolume: Number(variant.volume),
    variantUnit: variant.unitOfMeasurement,
    price: Number(variant.price),
    maxQuantity: variant.maxQuantityPerOrder ?? 99,
    commissionType: variant.commissionType ?? null,
    commissionValue: variant.commissionValue == null ? null : Number(variant.commissionValue),
  }
}

function AddToCart({ size = 'lg' }: { size?: 'lg' | 'default' }) {
  const t = useTranslation()
  const { product, selectedVariant, quantity } = useProductPurchase()
  const { addItem, open } = useCartActions()

  const handleAdd = () => {
    if (!selectedVariant) return
    addItem(buildCartItem(product, selectedVariant), quantity)
    open()
  }

  return (
    <Button
      size={size}
      variant="outline"
      onClick={handleAdd}
      disabled={!selectedVariant}
      className={cn(size === 'lg' && 'w-full rounded-xl', 'gap-2')}
    >
      <ShoppingCartIcon className="size-4" />
      {t.shop_product_add_to_cart}
    </Button>
  )
}

function ProceedToCheckout({ size = 'lg' }: { size?: 'lg' | 'default' }) {
  const t = useTranslation()
  const router = useRouter()
  const { lang } = useParams()
  const { product, selectedVariant, quantity } = useProductPurchase()
  const { addItem, close } = useCartActions()

  const handleCheckout = () => {
    if (!selectedVariant) return
    addItem(buildCartItem(product, selectedVariant), quantity)
    close()
    router.push(`/${lang}/checkout/order`)
  }

  return (
    <Button
      size={size}
      onClick={handleCheckout}
      disabled={!selectedVariant}
      className={cn(size === 'lg' && 'w-full rounded-xl', 'gap-2')}
    >
      {t.shop_product_proceed_to_checkout}
    </Button>
  )
}

function FullPanel() {
  return (
    <div className="flex flex-col gap-6">
      <Header />
      <CategoryTag />
      <VariantSelector />
      <Price />
      <div className="flex items-center gap-4">
        <QuantityStepper />
        <WishlistButton />
      </div>
      <div className="flex flex-col gap-3">
        <ProceedToCheckout />
        <AddToCart />
      </div>
    </div>
  )
}

export const ProductPurchase = {
  Provider,
  Header,
  CategoryTag,
  VariantSelector,
  Price,
  CompactPrice,
  QuantityStepper,
  WishlistButton,
  AddToCart,
  ProceedToCheckout,
  FullPanel,
}
