'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/context/translation.context'
import { usePaginatedList } from '@/lib/hooks/use-paginated-list'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import StarRatingDisplay from '@/components/review/star-rating-display'
import ReviewsGridLayout from '@/components/dashboard/reviews/reviews-grid-layout'
import { getOwnerReviewsAction } from '@/lib/actions/owner-reviews.actions'
import type { OwnerReview } from '@/lib/api/owner-reviews'

type OwnerReviewsContentProps = {
  initialReviews: OwnerReview[]
  initialNextCursor: string | null
}

const RATING_OPTIONS = ['1', '2', '3', '4', '5'] as const

export default function OwnerReviewsContent({ initialReviews, initialNextCursor }: OwnerReviewsContentProps) {
  const t = useTranslation() as Record<string, string>
  const [ratingFilter, setRatingFilter] = useState('all')
  const { items, nextCursor, filtering, filter, loadingMore, loadMore } = usePaginatedList<OwnerReview>(
    initialReviews,
    initialNextCursor
  )

  function buildFilters(rating: string) {
    return {
      rating: rating !== 'all' ? Number(rating) : undefined,
      limit: 20,
    }
  }

  function handleRatingChange(value: string) {
    setRatingFilter(value)
    filter(() => getOwnerReviewsAction(buildFilters(value)))
  }

  function handleLoadMore() {
    loadMore(() => getOwnerReviewsAction({ ...buildFilters(ratingFilter), cursor: nextCursor ?? undefined }))
  }

  return (
    <ReviewsGridLayout
      filtering={filtering}
      reviews={items}
      nextCursor={nextCursor}
      loadingMore={loadingMore}
      onLoadMore={handleLoadMore}
      emptyMessage={t.owner_reviews_empty}
      loadMoreLabel={t.admin_load_more}
    >
      <Select value={ratingFilter} onValueChange={handleRatingChange} disabled={filtering}>
        <SelectTrigger className="w-[180px] text-sm">
          <SelectValue placeholder={t.owner_reviews_filter_all} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.owner_reviews_filter_all}</SelectItem>
          {RATING_OPTIONS.map(r => (
            <SelectItem key={r} value={r}>
              <span className="flex items-center gap-1">
                <StarRatingDisplay rating={Number(r)} />
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </ReviewsGridLayout>
  )
}
