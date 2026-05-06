'use client'

import { StarIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import type { Review } from '@/lib/schemas/entities/experience.entity.schema'
import { Button } from '@/components/ui/button'

type ExperienceReviewsProps = {
  reviews: Review[]
}

const VISIBLE_LIMIT = 3

function getRelativeTime(
  dateStr: string,
  translations: { justNow: string; daysAgo: string; weeksAgo: string; monthsAgo: string }
): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 1) return translations.justNow
  if (diffDays < 7) return interpolate(translations.daysAgo, { count: String(diffDays) })
  if (diffDays < 30) return interpolate(translations.weeksAgo, { count: String(Math.floor(diffDays / 7)) })
  return interpolate(translations.monthsAgo, { count: String(Math.floor(diffDays / 30)) })
}

function ReviewCard({ review }: { review: Review }) {
  const t = useTranslation()

  const timeAgo = getRelativeTime(review.createdAt, {
    justNow: t.exp_detail_time_just_now,
    daysAgo: t.exp_detail_time_days_ago,
    weeksAgo: t.exp_detail_time_weeks_ago,
    monthsAgo: t.exp_detail_time_months_ago,
  })

  return (
    <div className="rounded-xl border p-4">
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          <span className="text-sm font-medium text-muted-foreground">
            {(review.userName ?? '?')[0].toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold">{review.userName ?? t.exp_detail_anonymous}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
      </div>

      {/* Stars */}
      <div className="mb-2 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={`size-3 ${i < review.rating ? 'fill-foreground text-foreground' : 'fill-muted text-muted'}`}
          />
        ))}
      </div>

      {/* Comment */}
      {review.comment && <p className="line-clamp-4 text-sm text-muted-foreground">{review.comment}</p>}
    </div>
  )
}

export default function ExperienceReviews({ reviews }: ExperienceReviewsProps) {
  const t = useTranslation()

  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  const visibleReviews = reviews.slice(0, VISIBLE_LIMIT)

  return (
    <div>
      {/* Rating header */}
      <div className="mb-6 flex items-center gap-2">
        <StarIcon className="size-5 fill-foreground" />
        <h2 className="text-xl font-bold">
          {interpolate(t.exp_detail_reviews_count, {
            rating: avgRating.toFixed(1),
            count: String(reviews.length),
          })}
        </h2>
      </div>

      {/* Review cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleReviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Show all button */}
      {reviews.length > VISIBLE_LIMIT && (
        <Button variant="outline" className="mt-6 w-full" onClick={() => null}>
          {t.exp_detail_show_all_reviews}
        </Button>
      )}
    </div>
  )
}
