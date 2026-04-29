'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/lib/context/translation.context'
import { ShoppingBagIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon, ImageIcon } from '@/lib/constants/icons'
import AdminEmptyState from '@/components/dashboard/admin-empty-state'
import type { ShopCategory } from '@/lib/schemas/entities/product.entity.schema'
import ShopCategoryDeleteDialog from './shop-category-delete-dialog'

type ShopCategoriesTableProps = {
  categories: ShopCategory[]
}

export default function ShopCategoriesTable({ categories }: ShopCategoriesTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<ShopCategory | null>(null)
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation()
  const basePath = `/${lang}/dashboard/admin/shop-categories`

  if (categories.length === 0) {
    return <AdminEmptyState icon={ShoppingBagIcon} message={t.admin_shop_cat_no_results} />
  }

  return (
    <>
      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16" />
              <TableHead>{t.admin_shop_cat_name}</TableHead>
              <TableHead>{t.admin_shop_cat_slug}</TableHead>
              <TableHead>{t.admin_shop_cat_sort_order}</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.id}>
                <TableCell>
                  {category.cover ? (
                    <Image
                      src={category.cover}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="size-10 rounded-lg object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-xl">
                      {category.icon || <ImageIcon className="size-4 text-muted-foreground" />}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {category.icon ? `${category.icon} ${category.name}` : category.name}
                </TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell className="text-muted-foreground">{category.sortOrder}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontalIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`${basePath}/${category.id}`}>
                          <PencilIcon className="size-4" />
                          {t.admin_common_edit}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(category)}>
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
        <ShopCategoryDeleteDialog
          categoryId={deleteTarget.id}
          categoryName={deleteTarget.name}
          open={!!deleteTarget}
          onOpenChange={open => !open && setDeleteTarget(null)}
        />
      )}
    </>
  )
}
