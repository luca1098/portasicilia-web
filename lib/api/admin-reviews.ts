import { apiServer } from './fetch-client'
import type { OwnerReview } from './owner-reviews'

export type AdminReview = OwnerReview & {
  ownerName: string
}

export type GetAdminReviewsParams = {
  listingId?: string
  rating?: number
  hasReply?: boolean
  search?: string
  source?: 'PORTASICILIA' | 'GOOGLE'
  listingType?: 'experience' | 'stay'
  limit?: number
  cursor?: string
}

export type PaginatedAdminReviews = {
  data: AdminReview[]
  nextCursor: string | null
}

export function getAdminReviews(headers: HeadersInit, filters?: GetAdminReviewsParams) {
  const params: Record<string, string> = {}
  if (filters?.listingId) params.listingId = filters.listingId
  if (filters?.rating !== undefined) params.rating = String(filters.rating)
  if (filters?.hasReply !== undefined) params.hasReply = String(filters.hasReply)
  if (filters?.search) params.search = filters.search
  if (filters?.source) params.source = filters.source
  if (filters?.listingType) params.listingType = filters.listingType
  if (filters?.limit) params.limit = String(filters.limit)
  if (filters?.cursor) params.cursor = filters.cursor
  return apiServer.get<PaginatedAdminReviews>('/reviews/admin', { params, headers })
}
