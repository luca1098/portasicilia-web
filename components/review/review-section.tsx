'use client'

import { StarIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import type { Review } from '@/lib/schemas/entities/experience.entity.schema'
import ReviewCard from '@/components/review/review-card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const VISIBLE_LIMIT = 3

const TRANSLATION_KEYS = {
  experience: {
    justNow: 'exp_detail_time_just_now',
    daysAgo: 'exp_detail_time_days_ago',
    weeksAgo: 'exp_detail_time_weeks_ago',
    monthsAgo: 'exp_detail_time_months_ago',
    anonymous: 'exp_detail_anonymous',
    showAll: 'exp_detail_show_all_reviews',
    reviewsCount: 'exp_detail_reviews_count',
  },
  stay: {
    justNow: 'stay_detail_time_just_now',
    daysAgo: 'stay_detail_time_days_ago',
    weeksAgo: 'stay_detail_time_weeks_ago',
    monthsAgo: 'stay_detail_time_months_ago',
    anonymous: 'stay_detail_anonymous',
    showAll: 'stay_detail_show_all_reviews',
    reviewsCount: 'stay_detail_reviews_count',
  },
} as const

type ReviewSectionProps = {
  reviews: Review[]
  listingType: 'experience' | 'stay'
}

export default function ReviewSection({ reviews, listingType }: ReviewSectionProps) {
  const t = useTranslation() as Record<string, string>

  const keys = TRANSLATION_KEYS[listingType]
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0
  const visibleReviews = reviews.slice(0, VISIBLE_LIMIT)

  const reviewTranslations = {
    justNow: t[keys.justNow],
    daysAgo: t[keys.daysAgo],
    weeksAgo: t[keys.weeksAgo],
    monthsAgo: t[keys.monthsAgo],
    anonymous: t[keys.anonymous],
    showMore: t.review_show_more,
    showLess: t.review_show_less,
  }

  if (!reviews.length) return null
  return (
    <div>
      {/* Rating header */}
      <div className="mb-6 flex items-center gap-2">
        <StarIcon className="size-5 fill-foreground" />
        <h2 className="text-xl font-bold">
          {interpolate(t[keys.reviewsCount], {
            rating: avgRating.toFixed(1),
            count: String(reviews.length),
          })}
        </h2>
      </div>

      {/* Review cards */}
      {visibleReviews.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleReviews.map(review => (
            <ReviewCard key={review.id} review={review} translations={reviewTranslations} />
          ))}
        </div>
      )}

      {/* Show all reviews dialog */}
      {reviews.length > VISIBLE_LIMIT && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="mt-6 w-full">
              {t[keys.showAll]}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {interpolate(t[keys.reviewsCount], {
                  rating: avgRating.toFixed(1),
                  count: String(reviews.length),
                })}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} translations={reviewTranslations} />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
