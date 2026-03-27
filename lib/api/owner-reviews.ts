import { apiServer } from './fetch-client'
import type { Review } from '@/lib/schemas/entities/experience.entity.schema'

export type OwnerReview = Review & {
  listingId: string
  listingName: string
  listingType: 'experience' | 'stay'
  listingCover: string | null
}

export type GetOwnerReviewsParams = {
  listingId?: string
  rating?: number
  hasReply?: boolean
  limit?: number
  cursor?: string
}

export type PaginatedOwnerReviews = {
  data: OwnerReview[]
  nextCursor: string | null
}

export function getOwnerReviews(headers: HeadersInit, filters?: GetOwnerReviewsParams) {
  const params: Record<string, string> = {}
  if (filters?.listingId) params.listingId = filters.listingId
  if (filters?.rating !== undefined) params.rating = String(filters.rating)
  if (filters?.hasReply !== undefined) params.hasReply = String(filters.hasReply)
  if (filters?.limit) params.limit = String(filters.limit)
  if (filters?.cursor) params.cursor = filters.cursor
  return apiServer.get<PaginatedOwnerReviews>('/reviews/owner', { params, headers })
}

export function replyToReview(
  listingType: 'experience' | 'stay',
  listingId: string,
  reviewId: string,
  reply: string,
  headers: HeadersInit
) {
  const endpoint =
    listingType === 'experience'
      ? `/experiences/${listingId}/reviews/${reviewId}/reply`
      : `/stays/${listingId}/reviews/${reviewId}/reply`
  return apiServer.patch<Review>(endpoint, { reply }, { headers })
}
