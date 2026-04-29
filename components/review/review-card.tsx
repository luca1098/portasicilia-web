'use client'

import { useState } from 'react'
import { GoogleIcon, ShieldCheckIcon } from '@/lib/constants/icons'
import { getRelativeTime } from '@/lib/utils/date.utils'
import type { Review } from '@/lib/schemas/entities/experience.entity.schema'
import Image from 'next/image'
import StarRatingDisplay from '@/components/review/star-rating-display'

type ReviewCardTranslations = {
  justNow: string
  daysAgo: string
  weeksAgo: string
  monthsAgo: string
  anonymous: string
  showMore: string
  showLess: string
  verified: string
}

type ReviewCardProps = {
  review: Review
  translations: ReviewCardTranslations
}

export default function ReviewCard({ review, translations }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)

  const timeAgo = getRelativeTime(review.createdAt, translations)
  const displayName = review.userName ?? review.authorName ?? translations.anonymous
  const displayImage = review.userImage ?? review.authorImage
  const initial = displayName[0].toUpperCase()
  const isGoogle = review.source === 'GOOGLE'

  return (
    <div>
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={displayName}
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
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
            {review.source === 'PORTASICILIA' && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                <ShieldCheckIcon className="size-3" />
                {translations.verified}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
      </div>

      {/* Stars */}
      <div className="mb-2">
        <StarRatingDisplay rating={review.rating} />
      </div>

      {/* Title */}
      {review.title && <p className="mb-1 text-sm font-semibold">{review.title}</p>}

      {/* Comment */}
      {review.comment && (
        <>
          <p className={`text-sm text-muted-foreground ${expanded ? '' : 'line-clamp-4'}`}>
            {review.comment}
          </p>
          {review.comment.length > 200 && (
            <button
              type="button"
              onClick={() => setExpanded(prev => !prev)}
              className="mt-1 text-xs font-semibold underline"
            >
              {expanded ? translations.showLess : translations.showMore}
            </button>
          )}
        </>
      )}
    </div>
  )
}
