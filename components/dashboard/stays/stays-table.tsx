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
import { HomeIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon, ImageIcon } from '@/lib/constants/icons'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import StayDeleteDialog from './stay-delete-dialog'

type StaysTableProps = {
  stays: Stay[]
}

export default function StaysTable({ stays }: StaysTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Stay | null>(null)
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>
  const basePath = `/${lang}/dashboard/admin/stays`

  if (stays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
          <HomeIcon className="size-6 text-muted-foreground/50" />
        </div>
        <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/70">
          {t.admin_stay_no_results}
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
              <TableHead>{t.admin_exp_name}</TableHead>
              <TableHead>{t.admin_exp_status}</TableHead>
              <TableHead>{t.admin_stay_col_guests}</TableHead>
              <TableHead>{t.admin_stay_col_beds}</TableHead>
              <TableHead>{t.admin_exp_city}</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {stays.map(stay => (
              <TableRow key={stay.id}>
                <TableCell>
                  {stay.cover ? (
                    <Image
                      src={stay.cover}
                      alt={stay.name}
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
                  <span>{stay.name}</span>
                  {stay.highlighted && (
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {t.admin_exp_highlighted}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {t[`admin_exp_status_${stay.status.toLowerCase()}`]}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{stay.stayDetail?.maxPeople}</TableCell>
                <TableCell className="text-muted-foreground">{stay.stayDetail?.bedNumber}</TableCell>
                <TableCell className="text-muted-foreground">{stay.city}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontalIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`${basePath}/${stay.id}`}>
                          <PencilIcon className="size-4" />
                          {t.admin_common_edit}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(stay)}>
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
        <StayDeleteDialog
          stayId={deleteTarget.id}
          stayName={deleteTarget.name}
          open={!!deleteTarget}
          onOpenChange={open => !open && setDeleteTarget(null)}
        />
      )}
    </>
  )
}
