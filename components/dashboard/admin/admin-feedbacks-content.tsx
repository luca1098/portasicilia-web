'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/context/translation.context'
import { usePaginatedList } from '@/lib/hooks/use-paginated-list'
import { formatDate } from '@/lib/utils/format.utils'
import { StarIcon } from '@/lib/constants/icons'
import StarRatingDisplay from '@/components/review/star-rating-display'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InputWrapper } from '@/components/form/input-wrapper'
import { getCheckoutFeedbacksAction } from '@/lib/actions/checkout-feedback.actions'
import type {
  CheckoutFeedback,
  CheckoutFeedbackStats,
  GetCheckoutFeedbacksParams,
} from '@/lib/api/checkout-feedback'

type AdminFeedbacksContentProps = {
  initialFeedbacks: CheckoutFeedback[]
  initialNextCursor: string | null
  stats: CheckoutFeedbackStats
}

const RATING_OPTIONS = ['5', '4', '3', '2', '1'] as const

function userName(user: CheckoutFeedback['user'], fallback: string) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  return name || user.email || fallback
}

function userInitials(user: CheckoutFeedback['user']) {
  const first = user.firstName?.[0] ?? user.email[0] ?? '?'
  const last = user.lastName?.[0] ?? ''
  return `${first}${last}`.toUpperCase()
}

export default function AdminFeedbacksContent({
  initialFeedbacks,
  initialNextCursor,
  stats,
}: AdminFeedbacksContentProps) {
  const t = useTranslation() as Record<string, string>
  const [ratingFilter, setRatingFilter] = useState('all')
  const { items, nextCursor, filtering, filter, loadingMore, loadMore } = usePaginatedList<CheckoutFeedback>(
    initialFeedbacks,
    initialNextCursor
  )

  function buildFilters(rating: string): GetCheckoutFeedbacksParams {
    return {
      rating: rating !== 'all' ? Number(rating) : undefined,
      limit: 20,
    }
  }

  function handleRatingChange(value: string) {
    setRatingFilter(value)
    filter(() => getCheckoutFeedbacksAction(buildFilters(value)))
  }

  function handleLoadMore() {
    loadMore(() =>
      getCheckoutFeedbacksAction({ ...buildFilters(ratingFilter), cursor: nextCursor ?? undefined })
    )
  }

  const average = stats.averageRating ? stats.averageRating.toFixed(1) : '—'

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border bg-background p-4">
          <p className="text-xs font-medium text-muted-foreground">{t.admin_feedbacks_stat_total}</p>
          <p className="mt-1 text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-xl border bg-background p-4">
          <p className="text-xs font-medium text-muted-foreground">{t.admin_feedbacks_stat_average}</p>
          <p className="mt-1 flex items-center gap-1.5 text-2xl font-bold">
            {average}
            <StarIcon className="size-5 fill-amber-400 text-amber-400" />
          </p>
        </div>
        <div className="col-span-2 rounded-xl border bg-background p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            {t.admin_feedbacks_stat_distribution}
          </p>
          <div className="space-y-1">
            {RATING_OPTIONS.map(r => {
              const count = stats.byRating?.[r] ?? 0
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              return (
                <div key={r} className="flex items-center gap-2 text-xs">
                  <span className="w-3 shrink-0 tabular-nums text-muted-foreground">{r}</span>
                  <StarIcon className="size-3 shrink-0 fill-amber-400 text-amber-400" />
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 shrink-0 text-right tabular-nums text-muted-foreground">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex justify-end">
        <InputWrapper label={t.admin_feedbacks_filter_rating} hasValue className="w-[180px]">
          <Select value={ratingFilter} onValueChange={handleRatingChange} disabled={filtering}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.admin_feedbacks_filter_all}</SelectItem>
              {RATING_OPTIONS.map(r => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </InputWrapper>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="rounded-xl border bg-background py-16 text-center text-sm text-muted-foreground">
          {t.admin_feedbacks_empty}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(feedback => (
            <div key={feedback.id} className="rounded-xl border bg-background p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {userInitials(feedback.user)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {userName(feedback.user, t.admin_feedbacks_anonymous)}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{feedback.user.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StarRatingDisplay rating={feedback.rating} size="size-4" />
                      <span className="text-xs text-muted-foreground">{formatDate(feedback.createdAt)}</span>
                    </div>
                  </div>
                  {feedback.comment && (
                    <p className="mt-2 whitespace-pre-line text-sm text-foreground/80">{feedback.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {nextCursor && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore}>
                {t.admin_load_more}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
