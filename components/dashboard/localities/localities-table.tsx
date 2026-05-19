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
import { MapPinnedIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon, ImageIcon } from '@/lib/constants/icons'
import type { Locality } from '@/lib/schemas/entities/locality.entity.schema'
import LocalityDeleteDialog from './locality-delete-dialog'
import { LocalityTranslationStatusPopover } from '@/components/dashboard/translation-status-popover'

type LocalitiesTableProps = {
  localities: Locality[]
}

export default function LocalitiesTable({ localities }: LocalitiesTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Locality | null>(null)
  const params = useParams()
  const router = useRouter()
  const lang = params.lang as string
  const t = useTranslation()
  const basePath = `/${lang}/dashboard/admin/locations`

  if (localities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
          <MapPinnedIcon className="size-6 text-muted-foreground/50" />
        </div>
        <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/70">
          {t.admin_loc_no_results}
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
              <TableHead>{t.admin_loc_name}</TableHead>
              <TableHead>{t.admin_loc_slug}</TableHead>
              <TableHead className="text-center">{t.admin_loc_tips_count}</TableHead>
              <TableHead>{t.admin_col_translations}</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {localities.map(locality => (
              <TableRow key={locality.id}>
                <TableCell>
                  {locality.cover ? (
                    <Image
                      src={locality.cover}
                      alt={locality.name}
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
                  <span>{locality.name}</span>
                  {locality.highlighted && (
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {t.admin_loc_highlighted}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{locality.slug}</TableCell>
                <TableCell className="text-center">{locality.tips?.length ?? 0}</TableCell>
                <TableCell>
                  <LocalityTranslationStatusPopover
                    listingId={locality.id}
                    status={locality.translationStatus}
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
                        <Link href={`${basePath}/${locality.id}`}>
                          <PencilIcon className="size-4" />
                          {t.admin_common_edit}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(locality)}>
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
        <LocalityDeleteDialog
          localityId={deleteTarget.id}
          localityName={deleteTarget.name}
          open={!!deleteTarget}
          onOpenChange={open => !open && setDeleteTarget(null)}
        />
      )}
    </>
  )
}
