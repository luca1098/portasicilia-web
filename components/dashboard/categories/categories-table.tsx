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
import { LayersIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon, ImageIcon } from '@/lib/constants/icons'
import { categoryIconMap } from '@/lib/constants/category-icons'
import type { Category } from '@/lib/schemas/entities/category.entity.schema'
import TranslationStatusPopover from '@/components/dashboard/translation-status-popover'
import CategoryDeleteDialog from './category-delete-dialog'

type CategoriesTableProps = {
  categories: Category[]
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const params = useParams()
  const router = useRouter()
  const lang = params.lang as string
  const t = useTranslation()
  const basePath = `/${lang}/dashboard/admin/categories`

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
          <LayersIcon className="size-6 text-muted-foreground/50" />
        </div>
        <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/70">
          {t.admin_cat_no_results}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16" />
              <TableHead>{t.admin_cat_name}</TableHead>
              <TableHead>{t.admin_cat_slug}</TableHead>
              <TableHead>{t.admin_col_translations}</TableHead>
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
                      {(() => {
                        if (!category.icon) {
                          return <ImageIcon className="size-4 text-muted-foreground" />
                        }
                        const LegacyIcon = categoryIconMap[category.icon]
                        if (LegacyIcon) return <LegacyIcon className="size-4 text-muted-foreground" />
                        return category.icon
                      })()}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  <span>
                    {category.icon && !categoryIconMap[category.icon]
                      ? `${category.icon} ${category.name}`
                      : category.name}
                  </span>
                  {category.highlighted && (
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {t.admin_cat_highlighted}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell>
                  <TranslationStatusPopover
                    listingId={category.id}
                    entityType="category"
                    status={category.translationStatus}
                    onTranslationComplete={() => router.refresh()}
                  />
                </TableCell>
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
        <CategoryDeleteDialog
          categoryId={deleteTarget.id}
          categoryName={deleteTarget.name}
          open={!!deleteTarget}
          onOpenChange={open => !open && setDeleteTarget(null)}
        />
      )}
    </>
  )
}
