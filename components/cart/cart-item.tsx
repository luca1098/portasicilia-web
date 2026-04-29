'use client'

import Image from 'next/image'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { CartItem as CartItemType } from '@/core/store/cart.store'
import { useCartActions } from '@/core/store/cart.store'
import { useTranslation } from '@/lib/context/translation.context'
import { formatCurrency } from '@/lib/utils/format.utils'
import { Trash2Icon } from '@/lib/constants/icons'

type CartItemProps = {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const t = useTranslation()
  const { lang } = useParams()
  const { setQuantity, removeItem } = useCartActions()

  const href = `/${lang}/shop/${item.productSlug}`
  const options = Array.from({ length: Math.max(1, item.maxQuantity) }, (_, i) => i + 1)

  return (
    <div className="flex items-center gap-3">
      <Link href={href} className="relative size-[72px] shrink-0 overflow-hidden rounded-xl bg-muted">
        {item.productCover && (
          <Image
            src={item.productCover}
            alt={item.productName}
            fill
            sizes="72px"
            className="object-cover"
            unoptimized
          />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <Link href={href} className="line-clamp-2 text-sm font-semibold leading-snug">
          {item.productName}
        </Link>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-sm font-bold">{formatCurrency(String(item.price))}</span>
          <span className="text-xs text-muted-foreground">/ {item.variantUnit}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="relative">
          <label className="absolute -top-1 left-2 z-10 bg-background px-1 text-[10px] text-muted-foreground">
            {t.cart_qty_label}
          </label>
          <select
            value={item.quantity}
            onChange={e => setQuantity(item.variantId, Number(e.target.value))}
            className="appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-7 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label={t.cart_qty_label}
          >
            {options.map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => removeItem(item.variantId)}
          aria-label={t.cart_remove_item}
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
        >
          <Trash2Icon className="size-4" />
        </button>
      </div>
    </div>
  )
}
