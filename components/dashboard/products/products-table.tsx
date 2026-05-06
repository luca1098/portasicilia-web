'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/lib/context/translation.context'
import { PackageIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon, ImageIcon } from '@/lib/constants/icons'
import AdminEmptyState from '@/components/dashboard/admin-empty-state'
import { ProductTranslationStatusPopover } from '@/components/dashboard/translation-status-popover'
import type { Product } from '@/lib/schemas/entities/product.entity.schema'
import { formatCurrency } from '@/lib/utils/format.utils'
import ProductDeleteDialog from './product-delete-dialog'

type ProductsTableProps = {
  products: Product[]
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const params = useParams()
  const router = useRouter()
  const lang = params.lang as string
  const t = useTranslation()
  const basePath = `/${lang}/dashboard/admin/products`

  const getPriceRange = (product: Product) => {
    if (product.variants.length === 0) return '—'
    const prices = product.variants.map(v => Number(v.price))
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    if (min === max) return formatCurrency(String(min))
    return `${formatCurrency(String(min))} - ${formatCurrency(String(max))}`
  }

  if (products.length === 0) {
    return <AdminEmptyState icon={PackageIcon} message={t.admin_product_no_results} />
  }

  return (
    <>
      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16" />
              <TableHead>{t.admin_product_name}</TableHead>
              <TableHead>{t.admin_product_col_category}</TableHead>
              <TableHead>{t.admin_product_col_variants}</TableHead>
              <TableHead>{t.admin_product_col_price}</TableHead>
              <TableHead>{t.admin_col_translations}</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow
                key={product.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`${basePath}/${product.id}`)}
              >
                <TableCell>
                  {product.cover ? (
                    <Image
                      src={product.cover}
                      alt={product.name}
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
                </TableCell>
                <TableCell className="font-medium">
                  <span>{product.name}</span>
                  {product.highlighted && (
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {t.admin_product_highlighted}
                    </span>
                  )}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      product.active ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {product.active ? t.admin_product_badge_active : t.admin_product_badge_inactive}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {product.category?.name ?? t.admin_product_no_category}
                </TableCell>
                <TableCell className="text-muted-foreground">{product.variants.length}</TableCell>
                <TableCell className="text-muted-foreground">{getPriceRange(product)}</TableCell>
                <TableCell onClick={e => e.stopPropagation()}>
                  <ProductTranslationStatusPopover
                    listingId={product.id}
                    status={product.translationStatus}
                    onTranslationComplete={() => router.refresh()}
                  />
                </TableCell>
                <TableCell onClick={e => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontalIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`${basePath}/${product.id}`}>
                          <PencilIcon className="size-4" />
                          {t.admin_common_edit}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(product)}>
                        <Trash2Icon className="size-4" />
                        {t.admin_common_delete}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {deleteTarget && (
        <ProductDeleteDialog
          productId={deleteTarget.id}
          productName={deleteTarget.name}
          open={!!deleteTarget}
          onOpenChange={open => !open && setDeleteTarget(null)}
        />
      )}
    </>
  )
}
