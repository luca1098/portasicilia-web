'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/lib/context/translation.context'
import { StoreIcon, MoreHorizontalIcon, PencilIcon, Search, Trash2Icon } from '@/lib/constants/icons'
import AdminEmptyState from '@/components/dashboard/admin-empty-state'
import { formatDate } from '@/lib/utils/format.utils'
import { api } from '@/lib/api/fetch-client'
import type { AdminOwner, AdminOwnerListResponse } from '@/lib/schemas/entities/owner.entity.schema'
import OwnerDeleteDialog from './owner-delete-dialog'
import { OwnerStatusBadge } from './owner-status-badge'

type OwnersTableProps = {
  initialData: AdminOwnerListResponse
}

export default function OwnersTable({ initialData }: OwnersTableProps) {
  const params = useParams()
  const router = useRouter()
  const lang = params.lang as string
  const t = useTranslation()
  const basePath = `/${lang}/dashboard/admin/owners`

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(initialData.page)
  const [data, setData] = useState<AdminOwnerListResponse>(initialData)
  const [loading, setLoading] = useState(false)
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminOwner | null>(null)

  const limit = initialData.limit
  const totalPages = Math.ceil(data.total / limit)

  const fetchOwners = useCallback(
    async (nextSearch: string, nextPage: number) => {
      setLoading(true)
      try {
        const queryParams: Record<string, string> = {
          page: nextPage.toString(),
          limit: limit.toString(),
        }
        if (nextSearch) queryParams.search = nextSearch
        const result = await api.get<AdminOwnerListResponse>('/admin/owners', { params: queryParams })
        setData(result)
        setPage(nextPage)
      } catch {
        // silently keep previous data
      } finally {
        setLoading(false)
      }
    },
    [limit]
  )

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (searchTimer) clearTimeout(searchTimer)
    const timer = setTimeout(() => {
      fetchOwners(value, 1)
    }, 400)
    setSearchTimer(timer)
  }

  const handlePageChange = (nextPage: number) => {
    fetchOwners(search, nextPage)
  }

  const owners: AdminOwner[] = data.data

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t.admin_owners_search_placeholder}
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {owners.length === 0 && !loading ? (
        <AdminEmptyState icon={StoreIcon} message={t.admin_owners_no_results} />
      ) : (
        <div className={`rounded-xl border border-border transition-opacity ${loading ? 'opacity-60' : ''}`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.admin_owners_col_name}</TableHead>
                <TableHead>{t.admin_owners_col_email}</TableHead>
                <TableHead>{t.admin_owners_col_phone}</TableHead>
                <TableHead>{t.admin_owners_col_business}</TableHead>
                <TableHead>{t.admin_owners_col_status}</TableHead>
                <TableHead>{t.admin_owners_col_created}</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {owners.map(owner => (
                <TableRow
                  key={owner.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`${basePath}/${owner.id}`)}
                >
                  <TableCell className="font-medium">
                    {owner.firstName} {owner.lastName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{owner.email}</TableCell>
                  <TableCell className="text-muted-foreground">{owner.phone ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{owner.businessName ?? '—'}</TableCell>
                  <TableCell>
                    <OwnerStatusBadge
                      claimedAt={owner.claimedAt}
                      manualLabel={t.admin_owners_badge_manual}
                      claimedLabel={t.admin_owners_badge_claimed}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(owner.createdAt)}
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
                          <Link href={`${basePath}/${owner.id}`}>
                            <PencilIcon className="size-4" />
                            {t.admin_common_edit}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(owner)}
                        >
                          <Trash2Icon className="size-4" />
                          {t.admin_owners_delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data.total} owner{data.total !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => handlePageChange(page - 1)}
            >
              &larr;
            </Button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => handlePageChange(page + 1)}
            >
              &rarr;
            </Button>
          </div>
        </div>
      )}

      {deleteTarget && (
        <OwnerDeleteDialog
          ownerId={deleteTarget.id}
          ownerName={`${deleteTarget.firstName} ${deleteTarget.lastName}`}
          ownerEmail={deleteTarget.email}
          open={deleteTarget !== null}
          onOpenChange={open => {
            if (!open) setDeleteTarget(null)
          }}
          onDeleted={deletedId => {
            setData(prev => ({
              ...prev,
              data: prev.data.filter(o => o.id !== deletedId),
              total: Math.max(0, prev.total - 1),
            }))
            if (data.data.length === 1 && page > 1) {
              fetchOwners(search, page - 1)
            }
          }}
        />
      )}
    </div>
  )
}
