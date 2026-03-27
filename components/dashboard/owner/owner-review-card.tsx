'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslation } from '@/lib/context/translation.context'
import { cn } from '@/lib/utils/shadcn.utils'
import { GoogleIcon } from '@/lib/constants/icons'
import { Badge } from '@/components/ui/badge'
import { getRelativeTime } from '@/lib/utils/date.utils'
import StarRatingDisplay from '@/components/review/star-rating-display'
import type { OwnerReview } from '@/lib/api/owner-reviews'

type OwnerReviewCardProps = {
  review: OwnerReview
}

export default function OwnerReviewCard({ review }: OwnerReviewCardProps) {
  const t = useTranslation() as Record<string, string>
  const [expanded, setExpanded] = useState(false)

  const timeTranslations = {
    justNow: t.exp_detail_time_just_now,
    daysAgo: t.exp_detail_time_days_ago,
    weeksAgo: t.exp_detail_time_weeks_ago,
    monthsAgo: t.exp_detail_time_months_ago,
  }

  const timeAgo = getRelativeTime(review.createdAt, timeTranslations)
  const displayName = review.userName ?? review.authorName ?? t.exp_detail_anonymous
  const initial = displayName[0].toUpperCase()
  const isGoogle = review.source === 'GOOGLE'

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      {/* Listing badge */}
      <div className="flex items-center gap-2">
        {review.listingCover ? (
          <Image
            src={review.listingCover}
            alt={review.listingName}
            width={28}
            height={28}
            className="size-7 rounded-md object-cover"
            unoptimized
          />
        ) : null}
        <Badge variant="secondary" className="text-xs font-medium">
          {review.listingName}
        </Badge>
      </div>

      {/* Reviewer header */}
      <div className="flex items-center gap-3">
        {(review.userImage ?? review.authorImage) ? (
          <Image
            src={(review.userImage ?? review.authorImage) as string}
            alt={displayName}
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <span className="text-sm font-medium text-muted-foreground">{initial}</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            {isGoogle && <GoogleIcon className="size-3.5 shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
      </div>

      {/* Stars */}
      <StarRatingDisplay rating={review.rating} size="size-3.5" />

      {/* Title */}
      {review.title && <p className="text-sm font-semibold">{review.title}</p>}

      {/* Comment */}
      {review.comment && (
        <div>
          <p className={cn('text-sm text-muted-foreground', !expanded && 'line-clamp-4')}>{review.comment}</p>
          {review.comment.length > 200 && (
            <button
              type="button"
              onClick={() => setExpanded(prev => !prev)}
              className="mt-1 text-xs font-semibold underline"
            >
              {expanded ? t.review_show_less : t.review_show_more}
            </button>
          )}
        </div>
      )}

      {/* Reply (read-only) */}
      {review.reply && (
        <div className="border-t border-border pt-3">
          <div className="rounded-lg bg-muted/50 px-4 py-3 space-y-1">
            <span className="text-xs font-semibold text-primary">{t.owner_reviews_replied}</span>
            <p className="text-sm text-muted-foreground">{review.reply}</p>
          </div>
        </div>
      )}
    </div>
  )
}
