'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputWrapper } from '@/components/form/input-wrapper'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { usePaginatedList } from '@/lib/hooks/use-paginated-list'
import {
  PackageIcon,
  MoreHorizontalIcon,
  EyeIcon,
  ImageIcon,
  LoaderIcon,
  TruckIcon,
  CheckCircle2Icon,
  RotateCcwIcon,
  XIcon,
} from '@/lib/constants/icons'
import { getOwnerOrdersAction, updateOwnerOrderStatusAction } from '@/lib/actions/owner-orders.actions'
import { formatDate, formatCurrency } from '@/lib/utils/format.utils'
import type { AdminOrder, OrderSort, OrderStatus } from '@/lib/api/orders'
import type { GetOwnerOrdersParams } from '@/lib/api/owner-orders'
import OrderDetailDialog from '@/components/dashboard/orders/order-detail-dialog'

type OwnerOrdersTableProps = {
  initialOrders: AdminOrder[]
  initialNextCursor: string | null
  fetchParams: GetOwnerOrdersParams
}

const STATUS_FLOW: OrderStatus[] = [
  'PENDING',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
]

function StatusBadge({ status, t }: { status: OrderStatus; t: Record<string, string> }) {
  const colorMap: Record<OrderStatus, string> = {
    PENDING: 'bg-amber-100 text-amber-800',
    PAID: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-indigo-100 text-indigo-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-slate-100 text-slate-800',
  }

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorMap[status] || 'bg-muted text-muted-foreground'}`}
    >
      {t[`admin_order_status_${status.toLowerCase()}`] || status}
    </span>
  )
}

function PaymentBadge({ status, t }: { status: string; t: Record<string, string> }) {
  const colorMap: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800',
    PAID: 'bg-green-100 text-green-800',
    REFUNDED: 'bg-blue-100 text-blue-800',
    FAILED: 'bg-red-100 text-red-800',
  }

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorMap[status] || 'bg-muted text-muted-foreground'}`}
    >
      {t[`admin_payment_status_${status.toLowerCase()}`] || status}
    </span>
  )
}

function getCustomerName(order: AdminOrder) {
  const fromUser = [order.user.firstName, order.user.lastName].filter(Boolean).join(' ').trim()
  if (fromUser) return fromUser
  return [order.billingFirstName, order.billingLastName].filter(Boolean).join(' ').trim()
}

function getItemCount(order: AdminOrder) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

export default function OwnerOrdersTable({
  initialOrders,
  initialNextCursor,
  fetchParams,
}: OwnerOrdersTableProps) {
  const t = useTranslation() as Record<string, string>
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [sort, setSort] = useState<OrderSort>('newest')
  const [detailOrder, setDetailOrder] = useState<AdminOrder | null>(null)
  const {
    items: orders,
    setItems: setOrders,
    nextCursor,
    filtering,
    filter,
    loadingMore,
    loadMore,
  } = usePaginatedList<AdminOrder>(initialOrders, initialNextCursor)

  const { loading: updatingStatus, execute: executeStatusUpdate } = useAction<AdminOrder>({
    successMessage: t.admin_order_status_updated,
    onSuccess: data => {
      if (data) {
        setOrders(prev => prev.map(o => (o.id === data.id ? data : o)))
      }
    },
  })

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = searchInput.trim()
    setAppliedSearch(trimmed)
    filter(() =>
      getOwnerOrdersAction({
        ...fetchParams,
        search: trimmed || undefined,
        sort,
      })
    )
  }

  function handleSortChange(value: string) {
    const next = value as OrderSort
    setSort(next)
    filter(() =>
      getOwnerOrdersAction({
        ...fetchParams,
        search: appliedSearch || undefined,
        sort: next,
      })
    )
  }

  function handleLoadMore() {
    loadMore(() =>
      getOwnerOrdersAction({
        ...fetchParams,
        search: appliedSearch || undefined,
        sort,
        cursor: nextCursor ?? undefined,
      })
    )
  }

  function handleUpdateStatus(orderId: string, status: OrderStatus) {
    executeStatusUpdate(() => updateOwnerOrderStatusAction(orderId, status))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start gap-2">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2">
          <InputWrapper
            label={t.owner_orders_search_placeholder}
            htmlFor="owner-orders-search"
            hasValue={searchInput.length > 0}
            className="flex-1 max-w-md"
          >
            <Input
              id="owner-orders-search"
              type="search"
              value={searchInput}
              onChange={event => setSearchInput(event.target.value)}
              disabled={filtering}
              autoComplete="off"
            />
          </InputWrapper>
          <Button type="submit" disabled={filtering}>
            {filtering && <LoaderIcon className="size-4 animate-spin" />}
            {t.owner_orders_search_button}
          </Button>
        </form>
        <InputWrapper label={t.owner_orders_sort_label} hasValue className="w-[180px]">
          <Select value={sort} onValueChange={handleSortChange} disabled={filtering}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t.owner_orders_sort_newest}</SelectItem>
              <SelectItem value="oldest">{t.owner_orders_sort_oldest}</SelectItem>
            </SelectContent>
          </Select>
        </InputWrapper>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
            <PackageIcon className="size-6 text-muted-foreground/50" />
          </div>
          <p className="max-w-[260px] text-sm leading-relaxed text-muted-foreground/70">
            {appliedSearch ? t.owner_orders_search_no_results : t.owner_orders_no_results}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.admin_order_col_number}</TableHead>
                  <TableHead>{t.admin_order_col_customer}</TableHead>
                  <TableHead>{t.admin_order_col_date}</TableHead>
                  <TableHead>{t.admin_order_col_items}</TableHead>
                  <TableHead>{t.admin_order_col_total}</TableHead>
                  <TableHead>{t.admin_order_col_status}</TableHead>
                  <TableHead>{t.admin_order_col_payment}</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => {
                  const firstItem = order.items[0]
                  const itemCount = getItemCount(order)
                  return (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setDetailOrder(order)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {firstItem?.productCover ? (
                            <Image
                              src={firstItem.productCover}
                              alt={firstItem.productName}
                              width={40}
                              height={40}
                              className="size-10 rounded-lg object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                              <ImageIcon className="size-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium">{order.number}</span>
                            <span className="text-xs text-muted-foreground">
                              {firstItem?.productName ?? '—'}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{getCustomerName(order)}</span>
                          <span className="text-xs text-muted-foreground">{order.contactEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm">{itemCount}</TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} t={t} />
                      </TableCell>
                      <TableCell>
                        <PaymentBadge status={order.paymentStatus} t={t} />
                      </TableCell>
                      <TableCell onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" disabled={updatingStatus}>
                              <MoreHorizontalIcon className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setDetailOrder(order)}>
                              <EyeIcon className="size-4" />
                              {t.admin_order_action_view}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                              {t.admin_order_action_change_status}
                            </DropdownMenuLabel>
                            {STATUS_FLOW.filter(s => s !== order.status)
                              .filter(
                                s =>
                                  !(
                                    s === 'CANCELLED' &&
                                    (order.status === 'SHIPPED' || order.status === 'DELIVERED')
                                  )
                              )
                              .map(status => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() => handleUpdateStatus(order.id, status)}
                                >
                                  {status === 'PROCESSING' && <PackageIcon className="size-4" />}
                                  {status === 'SHIPPED' && <TruckIcon className="size-4" />}
                                  {status === 'DELIVERED' && <CheckCircle2Icon className="size-4" />}
                                  {status === 'CANCELLED' && <XIcon className="size-4" />}
                                  {status === 'REFUNDED' && <RotateCcwIcon className="size-4" />}
                                  {(status === 'PENDING' || status === 'PAID') && (
                                    <PackageIcon className="size-4" />
                                  )}
                                  {t[`admin_order_status_${status.toLowerCase()}`] || status}
                                </DropdownMenuItem>
                              ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {nextCursor && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore && <LoaderIcon className="size-4 animate-spin" />}
                {t.admin_load_more}
              </Button>
            </div>
          )}
        </>
      )}

      <OrderDetailDialog order={detailOrder} onClose={() => setDetailOrder(null)} />
    </div>
  )
}
