'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { ChevronDownIcon, ImageIcon, PackageIcon, XIcon, LoaderIcon } from '@/lib/constants/icons'
import { cancelUserOrderAction } from '@/lib/actions/user-orders.actions'
import { formatDate, formatCurrency } from '@/lib/utils/format.utils'
import { cn } from '@/lib/utils/shadcn.utils'
import type { UserOrder, UserOrderStatus } from '@/lib/api/user-orders'

const STATUS_COLORS: Record<UserOrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  PAID: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-slate-100 text-slate-800',
}

function StatusBadge({ status, t }: { status: UserOrderStatus; t: Record<string, string> }) {
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_COLORS[status] || 'bg-muted text-muted-foreground'
      )}
    >
      {t[`admin_order_status_${status.toLowerCase()}`] || status}
    </span>
  )
}

type UserOrderCardProps = {
  order: UserOrder
  onUpdated: (order: UserOrder) => void
}

export default function UserOrderCard({ order, onUpdated }: UserOrderCardProps) {
  const t = useTranslation() as Record<string, string>
  const [expanded, setExpanded] = useState(false)

  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)
  const firstItem = order.items[0]
  const canCancel = order.status === 'PAID' || order.status === 'PROCESSING'

  const { loading: cancelling, execute: executeCancel } = useAction<UserOrder>({
    successMessage: t.user_order_cancel_success,
    onSuccess: data => {
      if (data) onUpdated(data)
    },
  })

  function handleCancel() {
    if (!confirm(t.user_order_cancel_confirm)) return
    executeCancel(() => cancelUserOrderAction(order.id))
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card transition-colors">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 p-4 text-left hover:bg-muted/30"
      >
        {firstItem?.productCover ? (
          <Image
            src={firstItem.productCover}
            alt={firstItem.productName}
            width={56}
            height={56}
            className="size-14 shrink-0 rounded-lg object-cover"
            unoptimized
          />
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted">
            <ImageIcon className="size-5 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{order.number}</span>
            <StatusBadge status={order.status} t={t} />
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {firstItem?.productName ?? '—'}
            {order.items.length > 1 && (
              <span>
                {' '}
                · +{order.items.length - 1} {t.user_order_more_items}
              </span>
            )}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatDate(order.createdAt)} · {itemCount} {t.user_order_items_count}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-sm font-semibold tabular-nums">{formatCurrency(order.totalAmount)}</span>
          <ChevronDownIcon
            className={cn('size-4 text-muted-foreground transition-transform', expanded && 'rotate-180')}
          />
        </div>
      </button>

      {expanded && (
        <div className="space-y-5 border-t border-border bg-muted/20 p-5">
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.admin_order_detail_items}
            </h3>
            <div className="divide-y rounded-xl border border-border bg-card">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3">
                  {item.productCover ? (
                    <Image
                      src={item.productCover}
                      alt={item.productName}
                      width={40}
                      height={40}
                      className="size-10 shrink-0 rounded-lg object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <ImageIcon className="size-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.variantVolume} {item.variantUnit} × {item.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium tabular-nums">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-1 px-1 pt-2 text-sm">
              <div className="flex items-baseline justify-between gap-3 text-muted-foreground">
                <span>{t.admin_order_detail_subtotal}</span>
                <span className="tabular-nums">{formatCurrency(order.subtotalAmount)}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3 text-muted-foreground">
                <span>{t.admin_order_detail_shipping}</span>
                <span className="tabular-nums">{formatCurrency(order.shippingAmount)}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t border-border pt-2 text-base font-semibold">
                <span>{t.user_order_total}</span>
                <span className="tabular-nums">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <section className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.admin_order_detail_customer}
              </h3>
              <div className="rounded-xl border border-border bg-card p-3 text-sm">
                <p className="truncate font-medium">
                  {order.billingFirstName} {order.billingLastName}
                </p>
                <p className="truncate text-muted-foreground">{order.contactEmail}</p>
                <p className="truncate text-muted-foreground">{order.contactPhone}</p>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.admin_order_detail_shipping_address}
              </h3>
              <div className="space-y-0.5 break-words rounded-xl border border-border bg-card p-3 text-sm">
                <p className="font-medium">
                  {order.shippingFirstName} {order.shippingLastName}
                </p>
                <p className="text-muted-foreground">{order.shippingStreet}</p>
                <p className="text-muted-foreground">
                  {order.shippingZipCode} {order.shippingCity} ({order.shippingProvince})
                </p>
                <p className="text-muted-foreground">
                  {order.shippingRegion}
                  {order.shippingCountry ? ` — ${order.shippingCountry}` : ''}
                </p>
                {order.shippingNotes && (
                  <p className="pt-2 text-xs italic text-muted-foreground">{order.shippingNotes}</p>
                )}
              </div>
            </section>
          </div>

          {canCancel && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? <LoaderIcon className="size-4 animate-spin" /> : <XIcon className="size-4" />}
                {t.user_order_cancel}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function UserOrdersEmptyState() {
  const t = useTranslation() as Record<string, string>
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
        <PackageIcon className="size-6 text-muted-foreground/50" />
      </div>
      <p className="max-w-[260px] text-sm leading-relaxed text-muted-foreground/70">{t.user_orders_empty}</p>
    </div>
  )
}
