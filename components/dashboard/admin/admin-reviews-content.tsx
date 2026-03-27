'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/context/translation.context'
import { usePaginatedList } from '@/lib/hooks/use-paginated-list'
import { Search } from '@/lib/constants/icons'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import StarRatingDisplay from '@/components/review/star-rating-display'
import ReviewsGridLayout from '@/components/dashboard/reviews/reviews-grid-layout'
import { getAdminReviewsAction } from '@/lib/actions/admin-reviews.actions'
import type { AdminReview, GetAdminReviewsParams } from '@/lib/api/admin-reviews'

type AdminReviewsContentProps = {
  initialReviews: AdminReview[]
  initialNextCursor: string | null
}

const RATING_OPTIONS = ['1', '2', '3', '4', '5'] as const

export default function AdminReviewsContent({ initialReviews, initialNextCursor }: AdminReviewsContentProps) {
  const t = useTranslation() as Record<string, string>
  const [searchValue, setSearchValue] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [replyFilter, setReplyFilter] = useState('all')
  const { items, nextCursor, filtering, filter, loadingMore, loadMore } = usePaginatedList<AdminReview>(
    initialReviews,
    initialNextCursor
  )

  function buildFilters(
    search: string,
    source: string,
    type: string,
    rating: string,
    reply: string
  ): GetAdminReviewsParams {
    return {
      search: search.trim() || undefined,
      source: source !== 'all' ? (source as GetAdminReviewsParams['source']) : undefined,
      listingType: type !== 'all' ? (type as 'experience' | 'stay') : undefined,
      rating: rating !== 'all' ? Number(rating) : undefined,
      hasReply: reply === 'replied' ? true : reply === 'unreplied' ? false : undefined,
      limit: 20,
    }
  }

  function runFilter(
    overrides: Partial<{
      search: string
      source: string
      type: string
      rating: string
      reply: string
    }> = {}
  ) {
    const merged = {
      search: overrides.search ?? searchValue,
      source: overrides.source ?? sourceFilter,
      type: overrides.type ?? typeFilter,
      rating: overrides.rating ?? ratingFilter,
      reply: overrides.reply ?? replyFilter,
    }
    filter(() =>
      getAdminReviewsAction(
        buildFilters(merged.search, merged.source, merged.type, merged.rating, merged.reply)
      )
    )
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') runFilter()
  }

  function handleSourceChange(value: string) {
    setSourceFilter(value)
    runFilter({ source: value })
  }

  function handleTypeChange(value: string) {
    setTypeFilter(value)
    runFilter({ type: value })
  }

  function handleRatingChange(value: string) {
    setRatingFilter(value)
    runFilter({ rating: value })
  }

  function handleReplyChange(value: string) {
    setReplyFilter(value)
    runFilter({ reply: value })
  }

  function handleLoadMore() {
    loadMore(() =>
      getAdminReviewsAction({
        ...buildFilters(searchValue, sourceFilter, typeFilter, ratingFilter, replyFilter),
        cursor: nextCursor ?? undefined,
      })
    )
  }

  return (
    <ReviewsGridLayout
      filtering={filtering}
      reviews={items}
      nextCursor={nextCursor}
      loadingMore={loadingMore}
      onLoadMore={handleLoadMore}
      emptyMessage={t.admin_reviews_empty}
      loadMoreLabel={t.admin_load_more}
    >
      {/* Search */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          onBlur={() => runFilter()}
          placeholder={t.admin_reviews_search}
          className="pl-9 text-sm"
          disabled={filtering}
        />
      </div>

      {/* Source filter */}
      <Select value={sourceFilter} onValueChange={handleSourceChange} disabled={filtering}>
        <SelectTrigger className="w-[180px] text-sm">
          <SelectValue placeholder={t.admin_reviews_source_all} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.admin_reviews_source_all}</SelectItem>
          <SelectItem value="PORTASICILIA">Porta Sicilia</SelectItem>
          <SelectItem value="GOOGLE">Google</SelectItem>
        </SelectContent>
      </Select>

      {/* Listing type filter */}
      <Select value={typeFilter} onValueChange={handleTypeChange} disabled={filtering}>
        <SelectTrigger className="w-[180px] text-sm">
          <SelectValue placeholder={t.admin_reviews_type_all} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.admin_reviews_type_all}</SelectItem>
          <SelectItem value="experience">{t.admin_sidebar_experiences}</SelectItem>
          <SelectItem value="stay">{t.admin_sidebar_stays}</SelectItem>
        </SelectContent>
      </Select>

      {/* Rating filter */}
      <Select value={ratingFilter} onValueChange={handleRatingChange} disabled={filtering}>
        <SelectTrigger className="w-[180px] text-sm">
          <SelectValue placeholder={t.owner_reviews_filter_rating} />
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

      {/* Reply status filter */}
      <Select value={replyFilter} onValueChange={handleReplyChange} disabled={filtering}>
        <SelectTrigger className="w-[180px] text-sm">
          <SelectValue placeholder={t.owner_reviews_filter_all} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.owner_reviews_filter_all}</SelectItem>
          <SelectItem value="replied">{t.owner_reviews_filter_replied}</SelectItem>
          <SelectItem value="unreplied">{t.owner_reviews_filter_unreplied}</SelectItem>
        </SelectContent>
      </Select>
    </ReviewsGridLayout>
  )
}
