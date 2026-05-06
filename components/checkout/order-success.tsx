'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CheckCircle2Icon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { formatCurrency } from '@/lib/utils/format.utils'
import { Button } from '@/components/ui/button'
import type { OrderResponse } from '@/lib/api/orders'

type OrderSuccessProps = {
  order: OrderResponse
}

export default function OrderSuccess({ order }: OrderSuccessProps) {
  const t = useTranslation()
  const { lang } = useParams<{ lang: string }>()

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="flex justify-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2Icon className="size-9 text-emerald-600" aria-hidden="true" />
        </div>
      </div>

      <h1 className="mt-6 text-center text-xl font-bold leading-snug">{t.order_success_title}</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {interpolate(t.order_success_subtitle, { number: order.number })}
      </p>

      <div className="mt-8 rounded-xl border bg-background">
        <div className="px-5 py-4">
          <h2 className="text-base font-semibold">{t.order_recap_title}</h2>
        </div>
        <hr className="border-border" />

        <div className="space-y-4 px-5 py-4">
          {order.items.map(item => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="relative size-[64px] shrink-0 overflow-hidden rounded-lg bg-muted">
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
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="line-clamp-2 text-sm font-semibold leading-snug">{item.productName}</span>
                <span className="text-xs text-muted-foreground">
                  {item.quantity} × {formatCurrency(item.unitPrice)}
                </span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <hr className="border-border" />
        <div className="space-y-2 px-5 py-4 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>{t.order_recap_subtotal}</span>
            <span>{formatCurrency(order.subtotalAmount)}</span>
          </div>
          {Number(order.shippingAmount) > 0 && (
            <div className="flex items-center justify-between text-muted-foreground">
              <span>{t.order_recap_shipping}</span>
              <span>{formatCurrency(order.shippingAmount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between font-semibold">
            <span>{t.order_success_total}</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button className="h-11 w-full" asChild>
          <Link href={`/${lang}`}>{t.booking_success_back_home}</Link>
        </Button>
      </div>
    </div>
  )
}
