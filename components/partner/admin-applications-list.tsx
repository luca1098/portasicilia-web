'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
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
  PartnerApplicationListResponse,
  PartnerApplicationStatus,
  PartnerApplicationSummary,
} from '@/lib/types/partner-application.type'
import { PartnerApplicationStatusBadge } from './partner-application-status-badge'

const STATUS_OPTIONS: PartnerApplicationStatus[] = ['PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED']

const STATUS_FILTER_LABEL_KEY: Record<PartnerApplicationStatus, string> = {
  PENDING: 'partner_admin_status_pending',
  IN_REVIEW: 'partner_admin_status_in_review',
  APPROVED: 'partner_admin_status_approved',
  REJECTED: 'partner_admin_status_rejected',
}

const PAGE_SIZE = 20

type Props = {
  lang: string
  initialData: PartnerApplicationListResponse
}

export default function AdminApplicationsList({ lang, initialData }: Props) {
  const t = useTranslation() as Record<string, string>
  const router = useRouter()
  const { data: session } = useSession()
  const basePath = `/${lang}/dashboard/admin/partner-applications`

  const [status, setStatus] = useState<PartnerApplicationStatus | ''>('')
  const [search, setSearch] = useState('')
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [page, setPage] = useState(initialData.page)
  const [data, setData] = useState<PartnerApplicationSummary[]>(initialData.data)
  const [total, setTotal] = useState(initialData.total)
  const [loading, setLoading] = useState(false)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const fetchApplications = useCallback(
    async (nextStatus: string, nextQ: string, nextPage: number) => {
      setLoading(true)
      try {
        const headers = session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : undefined
        const res = await listPartnerApplications(
          {
            status: (nextStatus as PartnerApplicationStatus) || undefined,
            q: nextQ || undefined,
            page: nextPage,
            pageSize: PAGE_SIZE,
          },
          headers
        )
        setData(res.data)
        setTotal(res.total)
        setPage(nextPage)
      } catch {
        // silently keep previous data
      } finally {
        setLoading(false)
      }
    },
    [session?.accessToken]
  )

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
                {t[STATUS_FILTER_LABEL_KEY[s]]}
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
                <TableRow
                  key={app.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`${basePath}/${app.id}`)}
                >
                  <TableCell className="font-medium">{app.businessName}</TableCell>
                  <TableCell className="text-muted-foreground">{app.email}</TableCell>
                  <TableCell className="text-muted-foreground">{app.locality}</TableCell>
                  <TableCell className="text-muted-foreground">{app.listingInterests.join(', ')}</TableCell>
                  <TableCell>
                    <PartnerApplicationStatusBadge status={app.status} />
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
