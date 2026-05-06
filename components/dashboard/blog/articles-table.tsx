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
import { NewspaperIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon, ImageIcon } from '@/lib/constants/icons'
import type { Article } from '@/lib/schemas/entities/article.entity.schema'
import ArticleStatusBadge from './article-status-badge'
import ArticleDeleteDialog from './article-delete-dialog'

type ArticlesTableProps = {
  articles: Article[]
}

const statusLabelKeys: Record<string, string> = {
  DRAFT: 'admin_article_status_draft',
  PUBLISHED: 'admin_article_status_published',
  ARCHIVED: 'admin_article_status_archived',
}

export default function ArticlesTable({ articles }: ArticlesTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null)
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>
  const basePath = `/${lang}/dashboard/admin/blog`

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
          <NewspaperIcon className="size-6 text-muted-foreground/50" />
        </div>
        <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/70">
          {t.admin_articles_no_results}
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
              <TableHead>{t.admin_article_title}</TableHead>
              <TableHead>{t.admin_article_author}</TableHead>
              <TableHead>{t.admin_article_status}</TableHead>
              <TableHead>{t.admin_article_published_at}</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map(article => (
              <TableRow key={article.id}>
                <TableCell>
                  {article.cover ? (
                    <Image
                      src={article.cover}
                      alt={article.title}
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
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell className="text-muted-foreground">{article.author?.name}</TableCell>
                <TableCell>
                  <ArticleStatusBadge status={article.status} label={t[statusLabelKeys[article.status]]} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '—'}
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
                        <Link href={`${basePath}/${article.id}`}>
                          <PencilIcon className="size-4" />
                          {t.admin_common_edit}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(article)}>
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
        <ArticleDeleteDialog
          articleId={deleteTarget.id}
          articleTitle={deleteTarget.title}
          open={!!deleteTarget}
          onOpenChange={open => !open && setDeleteTarget(null)}
        />
      )}
    </>
  )
}
