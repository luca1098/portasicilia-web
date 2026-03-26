'use client'

import { useState } from 'react'
import { StarIcon, GoogleIcon } from '@/lib/constants/icons'
import { interpolate } from '@/lib/utils/i18n.utils'
import type { Review } from '@/lib/schemas/entities/experience.entity.schema'
import Image from 'next/image'

type ReviewCardTranslations = {
  justNow: string
  daysAgo: string
  weeksAgo: string
  monthsAgo: string
  anonymous: string
  showMore: string
  showLess: string
}

type ReviewCardProps = {
  review: Review
  translations: ReviewCardTranslations
}

const STAR_INDICES = [0, 1, 2, 3, 4]

export function getRelativeTime(
  dateStr: string,
  translations: Pick<ReviewCardTranslations, 'justNow' | 'daysAgo' | 'weeksAgo' | 'monthsAgo'>
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

export default function ReviewCard({ review, translations }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)

  const timeAgo = getRelativeTime(review.createdAt, translations)
  const displayName = review.userName ?? translations.anonymous
  const initial = displayName[0].toUpperCase()
  const isGoogle = review.source === 'GOOGLE'

  return (
    <div>
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        {review.userImage ? (
          <Image
            src={review.userImage}
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
          </div>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
      </div>

      {/* Stars */}
      <div className="mb-2 flex gap-0.5">
        {STAR_INDICES.map(i => (
          <StarIcon
            key={i}
            className={`size-3 ${i < review.rating ? 'fill-foreground text-foreground' : 'fill-muted text-muted'}`}
          />
        ))}
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
