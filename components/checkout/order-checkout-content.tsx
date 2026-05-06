'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import useCartStore from '@/core/store/cart.store'
import { useOrderCheckoutActions } from '@/core/store/order-checkout.store'
import { computeCartTotals } from '@/lib/utils/order.utils'
import OrderCheckoutSteps from '@/components/checkout/order-checkout-steps'
import OrderRecap from '@/components/checkout/order-recap'

type OrderCheckoutContentProps = {
  paymentError: boolean
}

export default function OrderCheckoutContent({ paymentError }: OrderCheckoutContentProps) {
  const t = useTranslation()
  const router = useRouter()
  const { lang } = useParams<{ lang: string }>()
  const items = useCartStore(s => s.items)
  const { setOrderContext } = useOrderCheckoutActions()

  const totals = computeCartTotals(items, 0)
  const isEmpty = items.length === 0

  const backHref = `/${lang}/shop`

  useEffect(() => {
    if (isEmpty) {
      router.replace(`/${lang}`)
      return
    }
    setOrderContext({
      items,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      commissionAmount: totals.commissionAmount,
      depositAmount: totals.depositAmount,
      balanceDue: totals.balanceDue,
      total: totals.total,
      paymentError,
    })
  }, [
    items,
    totals.subtotal,
    totals.shipping,
    totals.commissionAmount,
    totals.depositAmount,
    totals.balanceDue,
    totals.total,
    paymentError,
    isEmpty,
    router,
    lang,
    setOrderContext,
  ])

  if (isEmpty) return null

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={t.checkout_back}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-bold">{t.order_checkout_title}</h1>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="order-2 lg:order-1">
          <OrderCheckoutSteps />
        </div>

        <div className="order-1 lg:sticky lg:top-24 lg:order-2 lg:self-start">
          <OrderRecap />
        </div>
      </div>
    </div>
  )
}
