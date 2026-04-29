'use client'

import { useParams, useRouter } from 'next/navigation'
import { ShoppingCartIcon } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTranslation } from '@/lib/context/translation.context'
import useCartStore, { useCartActions } from '@/core/store/cart.store'
import { formatCurrency } from '@/lib/utils/format.utils'
import CartItem from './cart-item'

export default function CartContent() {
  const t = useTranslation()
  const router = useRouter()
  const { lang } = useParams()
  const items = useCartStore(state => state.items)
  const { close } = useCartActions()

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handleCheckout = () => {
    close()
    router.push(`/${lang}/checkout/order`)
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
        <ShoppingCartIcon className="size-10 text-muted-foreground/40" />
        <p className="text-sm font-medium">{t.cart_empty}</p>
        <p className="text-xs text-muted-foreground">{t.cart_empty_description}</p>
      </div>
    )
  }

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-5 px-6 pb-6 pt-2">
          {items.map(item => (
            <CartItem key={item.variantId} item={item} />
          ))}
        </div>
      </ScrollArea>

      <div className="flex flex-col gap-4 border-t px-6 py-5">
        <div className="flex items-center justify-between rounded-2xl bg-muted px-5 py-4">
          <span className="text-base font-semibold">{t.cart_total}</span>
          <span className="text-base font-semibold">{formatCurrency(String(total))}</span>
        </div>
        <Button
          type="button"
          size="lg"
          onClick={handleCheckout}
          className="w-full rounded-2xl py-6 text-base font-semibold"
        >
          {t.cart_checkout}
        </Button>
      </div>
    </>
  )
}
