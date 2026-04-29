'use client'

import Image from 'next/image'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTranslation } from '@/lib/context/translation.context'
import { ImageIcon } from '@/lib/constants/icons'
import { formatCurrency, formatDate } from '@/lib/utils/format.utils'
import type { AdminOrder } from '@/lib/api/orders'

type OrderDetailDialogProps = {
  order: AdminOrder | null
  onClose: () => void
}

export default function OrderDetailDialog({ order, onClose }: OrderDetailDialogProps) {
  const t = useTranslation() as Record<string, string>

  return (
    <Dialog open={!!order} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden">
        {order && (
          <>
            <DialogHeader className="min-w-0">
              <DialogTitle className="truncate text-xl">
                {t.admin_order_detail_title} {order.number}
              </DialogTitle>
              <DialogDescription>{formatDate(order.createdAt)}</DialogDescription>
            </DialogHeader>

            <div className="min-w-0 space-y-6">
              <section className="min-w-0 space-y-2">
                <h3 className="text-sm font-semibold">{t.admin_order_detail_items}</h3>
                <div className="divide-y rounded-xl border border-border">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3">
                      {item.productCover ? (
                        <Image
                          src={item.productCover}
                          alt={item.productName}
                          width={48}
                          height={48}
                          className="size-12 shrink-0 rounded-lg object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <ImageIcon className="size-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.variantVolume} {item.variantUnit} × {item.quantity}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-medium">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 px-1 pt-2 text-sm">
                  <div className="flex items-baseline justify-between gap-3 text-muted-foreground">
                    <span className="min-w-0 truncate">{t.admin_order_detail_subtotal}</span>
                    <span className="shrink-0 tabular-nums">{formatCurrency(order.subtotalAmount)}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 text-muted-foreground">
                    <span className="min-w-0 truncate">{t.admin_order_detail_shipping}</span>
                    <span className="shrink-0 tabular-nums">{formatCurrency(order.shippingAmount)}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 border-t border-border pt-2 text-base font-semibold">
                    <span className="min-w-0 truncate">{t.admin_order_detail_total}</span>
                    <span className="shrink-0 tabular-nums">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                    {t.admin_order_detail_internal_breakdown}
                  </h4>
                  <div className="flex items-baseline justify-between gap-3 text-amber-900">
                    <span className="min-w-0 truncate">{t.admin_order_detail_commission}</span>
                    <span className="shrink-0 font-semibold tabular-nums">
                      − {formatCurrency(order.commissionAmount)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 border-t border-amber-300/60 pt-2 font-semibold text-amber-900">
                    <span className="min-w-0 truncate">{t.admin_order_detail_owner_payout}</span>
                    <span className="shrink-0 tabular-nums">
                      {formatCurrency(
                        (Number(order.totalAmount) - Number(order.commissionAmount)).toFixed(2)
                      )}
                    </span>
                  </div>
                  <p className="pt-1 text-xs leading-relaxed text-amber-800/80">
                    {t.admin_order_detail_internal_breakdown_note}
                  </p>
                </div>
              </section>

              <div className="grid gap-4 sm:grid-cols-2">
                <section className="min-w-0 space-y-2">
                  <h3 className="text-sm font-semibold">{t.admin_order_detail_customer}</h3>
                  <div className="rounded-xl border border-border p-3 text-sm">
                    <p className="truncate font-medium">
                      {order.billingFirstName} {order.billingLastName}
                    </p>
                    <p className="truncate text-muted-foreground">{order.contactEmail}</p>
                    <p className="truncate text-muted-foreground">{order.contactPhone}</p>
                  </div>
                </section>

                <section className="min-w-0 space-y-2">
                  <h3 className="text-sm font-semibold">{t.admin_order_detail_shipping_address}</h3>
                  <div className="space-y-0.5 break-words rounded-xl border border-border p-3 text-sm">
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
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
