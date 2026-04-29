'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslation } from '@/lib/context/translation.context'
import { formatCurrency } from '@/lib/utils/format.utils'
import useOrderCheckoutStore from '@/core/store/order-checkout.store'
import { useCartActions } from '@/core/store/cart.store'

export default function OrderRecap() {
  const t = useTranslation()
  const { lang } = useParams<{ lang: string }>()
  const orderContext = useOrderCheckoutStore(s => s.orderContext)
  const { setQuantity } = useCartActions()

  if (!orderContext) return null

  const { items, subtotal, shipping, total } = orderContext

  return (
    <aside className="rounded-xl border bg-background" aria-label={t.order_recap_title}>
      <div className="px-5 py-4">
        <h2 className="text-base font-semibold">{t.order_recap_title}</h2>
      </div>
      <hr className="border-border" />

      <div className="space-y-4 px-5 py-4">
        {items.map(item => {
          const href = `/${lang}/shop/${item.productSlug}`
          const options = Array.from({ length: Math.max(1, item.maxQuantity) }, (_, i) => i + 1)

          return (
            <div key={item.variantId} className="flex items-start gap-3">
              <Link href={href} className="relative size-[64px] shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.productCover && (
                  <Image
                    src={item.productCover}
                    alt={item.productName}
                    fill
                    sizes="64px"
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

              <div className="shrink-0">
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
              </div>
            </div>
          )
        })}
      </div>

      <hr className="border-border" />

      <div className="space-y-2 px-5 py-4 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{t.order_recap_subtotal}</span>
          <span>{formatCurrency(String(subtotal))}</span>
        </div>
        {shipping > 0 && (
          <div className="flex items-center justify-between text-muted-foreground">
            <span>{t.order_recap_shipping}</span>
            <span>{formatCurrency(String(shipping))}</span>
          </div>
        )}
        <div className="flex items-center justify-between font-semibold">
          <span>{t.order_recap_total_eur}</span>
          <span>{formatCurrency(String(total))}</span>
        </div>
      </div>
    </aside>
  )
}
