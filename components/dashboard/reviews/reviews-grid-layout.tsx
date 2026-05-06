import type { ReactNode } from 'react'
import { StarIcon, LoaderIcon } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'
import OwnerReviewCard from '@/components/dashboard/owner/owner-review-card'
import type { OwnerReview } from '@/lib/api/owner-reviews'

type ReviewsGridLayoutProps = {
  filtering: boolean
  reviews: OwnerReview[]
  nextCursor: string | null
  loadingMore: boolean
  onLoadMore: () => void
  emptyMessage: string
  loadMoreLabel: string
  children: ReactNode
}

export default function ReviewsGridLayout({
  filtering,
  reviews,
  nextCursor,
  loadingMore,
  onLoadMore,
  emptyMessage,
  loadMoreLabel,
  children,
}: ReviewsGridLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Filters (composed via children) */}
      <div className="flex flex-wrap gap-3">{children}</div>

      {/* Loading state */}
      {filtering ? (
        <div className="flex items-center justify-center py-10">
          <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
            <StarIcon className="size-6 text-muted-foreground/50" />
          </div>
          <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/70">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {reviews.map(review => (
              <OwnerReviewCard key={review.id} review={review} />
            ))}
          </div>

          {nextCursor && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={onLoadMore} disabled={loadingMore}>
                {loadingMore && <LoaderIcon className="size-4 animate-spin" />}
                {loadMoreLabel}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
