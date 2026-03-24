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
import { UsersIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon, UserIcon } from '@/lib/constants/icons'
import type { Author } from '@/lib/schemas/entities/author.entity.schema'
import AuthorDeleteDialog from './author-delete-dialog'

type AuthorsTableProps = {
  authors: Author[]
}

export default function AuthorsTable({ authors }: AuthorsTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Author | null>(null)
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation()
  const basePath = `/${lang}/dashboard/admin/blog/authors`

  if (authors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
          <UsersIcon className="size-6 text-muted-foreground/50" />
        </div>
        <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/70">
          {t.admin_authors_no_results}
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
              <TableHead>{t.admin_author_name}</TableHead>
              <TableHead>{t.admin_author_articles_count}</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors.map(author => (
              <TableRow key={author.id}>
                <TableCell>
                  {author.avatar ? (
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                      <UserIcon className="size-4 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{author.name}</TableCell>
                <TableCell className="text-muted-foreground">{author._count?.articles ?? 0}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontalIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`${basePath}/${author.id}`}>
                          <PencilIcon className="size-4" />
                          {t.admin_common_edit}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(author)}>
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
        <AuthorDeleteDialog
          authorId={deleteTarget.id}
          authorName={deleteTarget.name}
          open={!!deleteTarget}
          onOpenChange={open => !open && setDeleteTarget(null)}
        />
      )}
    </>
  )
}
