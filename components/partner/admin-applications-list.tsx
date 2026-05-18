'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/lib/context/translation.context'
import { listPartnerApplications } from '@/lib/api/partner-applications'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AdminEmptyState from '@/components/dashboard/admin-empty-state'
import { ClipboardListIcon, Search } from '@/lib/constants/icons'
import { formatDate } from '@/lib/utils/format.utils'
import type {
  PartnerApplicationStatus,
  PartnerApplicationSummary,
} from '@/lib/types/partner-application.type'

const STATUS_OPTIONS: PartnerApplicationStatus[] = ['PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED']

const STATUS_BADGE_CLASS: Record<PartnerApplicationStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_REVIEW: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}

const statusLabelKey = (
  s: PartnerApplicationStatus
):
  | 'partner_admin_status_pending'
  | 'partner_admin_status_in_review'
  | 'partner_admin_status_approved'
  | 'partner_admin_status_rejected' => {
  switch (s) {
    case 'PENDING':
      return 'partner_admin_status_pending'
    case 'IN_REVIEW':
      return 'partner_admin_status_in_review'
    case 'APPROVED':
      return 'partner_admin_status_approved'
    case 'REJECTED':
      return 'partner_admin_status_rejected'
  }
}

const PAGE_SIZE = 20

export default function AdminApplicationsList({ lang }: { lang: string }) {
  const t = useTranslation()

  const [status, setStatus] = useState<PartnerApplicationStatus | ''>('')
  const [search, setSearch] = useState('')
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [page, setPage] = useState(1)
  const [data, setData] = useState<PartnerApplicationSummary[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const fetchApplications = useCallback(async (nextStatus: string, nextQ: string, nextPage: number) => {
    setLoading(true)
    try {
      const res = await listPartnerApplications({
        status: (nextStatus as PartnerApplicationStatus) || undefined,
        q: nextQ || undefined,
        page: nextPage,
        pageSize: PAGE_SIZE,
      })
      setData(res.data)
      setTotal(res.total)
      setPage(nextPage)
    } catch {
      // silently keep previous data
    } finally {
      setLoading(false)
    }
  }, [])

  const handleStatusChange = (value: string) => {
    const next = value === 'ALL' ? '' : (value as PartnerApplicationStatus)
    setStatus(next)
    fetchApplications(next, search, 1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (searchTimer) clearTimeout(searchTimer)
    const timer = setTimeout(() => {
      fetchApplications(status, value, 1)
    }, 400)
    setSearchTimer(timer)
  }

  const handlePageChange = (nextPage: number) => {
    fetchApplications(status, search, nextPage)
  }

  useEffect(() => {
    fetchApplications('', '', 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select value={status || 'ALL'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t.partner_admin_filter_all}</SelectItem>
            {STATUS_OPTIONS.map(s => (
              <SelectItem key={s} value={s}>
                {t[statusLabelKey(s)]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder={t.partner_admin_search_placeholder}
            className="pl-9"
          />
        </div>
      </div>

      {data.length === 0 && !loading ? (
        <AdminEmptyState icon={ClipboardListIcon} message={t.partner_admin_empty} />
      ) : (
        <div className={`rounded-xl border border-border transition-opacity ${loading ? 'opacity-60' : ''}`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.partner_admin_col_business}</TableHead>
                <TableHead>{t.partner_admin_col_email}</TableHead>
                <TableHead>{t.partner_admin_col_locality}</TableHead>
                <TableHead>{t.partner_admin_col_types}</TableHead>
                <TableHead>{t.partner_admin_col_status}</TableHead>
                <TableHead>{t.partner_admin_col_submitted}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(app => (
                <TableRow key={app.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link
                      href={`/${lang}/dashboard/admin/partner-applications/${app.id}`}
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      {app.businessName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{app.email}</TableCell>
                  <TableCell className="text-muted-foreground">{app.locality}</TableCell>
                  <TableCell className="text-muted-foreground">{app.listingInterests.join(', ')}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[app.status]}`}
                    >
                      {t[statusLabelKey(app.status)]}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(app.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{total}</p>
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
    </div>
  )
}
