'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslation } from '@/lib/context/translation.context'
import { usePaginatedList } from '@/lib/hooks/use-paginated-list'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InputWrapper } from '@/components/form/input-wrapper'
import StarRatingDisplay from '@/components/review/star-rating-display'
import ReviewsGridLayout from '@/components/dashboard/reviews/reviews-grid-layout'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@/lib/constants/icons'
import { getAdminProductReviewsAction } from '@/lib/actions/admin-reviews.actions'
import type { AdminReview, GetAdminProductReviewsParams } from '@/lib/api/admin-reviews'

type AdminProductReviewsContentProps = {
  initialReviews: AdminReview[]
  initialNextCursor: string | null
}

const RATING_OPTIONS = ['1', '2', '3', '4', '5'] as const

export default function AdminProductReviewsContent({
  initialReviews,
  initialNextCursor,
}: AdminProductReviewsContentProps) {
  const t = useTranslation() as Record<string, string>
  const params = useParams()
  const lang = params.lang as string
  const [ratingFilter, setRatingFilter] = useState('all')
  const [replyFilter, setReplyFilter] = useState('all')
  const [sortFilter, setSortFilter] = useState<'newest' | 'oldest'>('newest')
  const { items, nextCursor, filtering, filter, loadingMore, loadMore } = usePaginatedList<AdminReview>(
    initialReviews,
    initialNextCursor
  )

  function buildFilters(
    rating: string,
    reply: string,
    sort: 'newest' | 'oldest'
  ): GetAdminProductReviewsParams {
    return {
      source: 'PORTASICILIA',
      rating: rating !== 'all' ? Number(rating) : undefined,
      hasReply: reply === 'replied' ? true : reply === 'unreplied' ? false : undefined,
      sort,
      limit: 20,
    }
  }

  function runFilter(overrides: Partial<{ rating: string; reply: string; sort: 'newest' | 'oldest' }> = {}) {
    const merged = {
      rating: overrides.rating ?? ratingFilter,
      reply: overrides.reply ?? replyFilter,
      sort: overrides.sort ?? sortFilter,
    }
    filter(() => getAdminProductReviewsAction(buildFilters(merged.rating, merged.reply, merged.sort)))
  }

  function handleRatingChange(value: string) {
    setRatingFilter(value)
    runFilter({ rating: value })
  }

  function handleReplyChange(value: string) {
    setReplyFilter(value)
    runFilter({ reply: value })
  }

  function handleSortChange(value: string) {
    const sort = value as 'newest' | 'oldest'
    setSortFilter(sort)
    runFilter({ sort })
  }

  function handleLoadMore() {
    loadMore(() =>
      getAdminProductReviewsAction({
        ...buildFilters(ratingFilter, replyFilter, sortFilter),
        cursor: nextCursor ?? undefined,
      })
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild size="default" className="shrink-0">
          <Link href={`/${lang}/dashboard/admin/shop-reviews/new`}>
            <PlusIcon className="size-4" />
            {t.admin_product_review_new_button}
          </Link>
        </Button>
      </div>

      <ReviewsGridLayout
        filtering={filtering}
        reviews={items}
        nextCursor={nextCursor}
        loadingMore={loadingMore}
        onLoadMore={handleLoadMore}
        emptyMessage={t.admin_shop_reviews_empty}
        loadMoreLabel={t.admin_load_more}
      >
        {/* Rating filter */}
        <InputWrapper label={t.admin_reviews_filter_rating_label} hasValue className="w-[180px]">
          <Select value={ratingFilter} onValueChange={handleRatingChange} disabled={filtering}>
            <SelectTrigger className="w-full">
              <SelectValue />
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
        </InputWrapper>

        {/* Reply status filter */}
        <InputWrapper label={t.admin_reviews_filter_reply_label} hasValue className="w-[180px]">
          <Select value={replyFilter} onValueChange={handleReplyChange} disabled={filtering}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.owner_reviews_filter_all}</SelectItem>
              <SelectItem value="replied">{t.owner_reviews_filter_replied}</SelectItem>
              <SelectItem value="unreplied">{t.owner_reviews_filter_unreplied}</SelectItem>
            </SelectContent>
          </Select>
        </InputWrapper>

        {/* Sort filter */}
        <InputWrapper label={t.admin_reviews_filter_sort_label} hasValue className="w-[180px]">
          <Select value={sortFilter} onValueChange={handleSortChange} disabled={filtering}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t.admin_reviews_sort_newest}</SelectItem>
              <SelectItem value="oldest">{t.admin_reviews_sort_oldest}</SelectItem>
            </SelectContent>
          </Select>
        </InputWrapper>
      </ReviewsGridLayout>
    </div>
  )
}
