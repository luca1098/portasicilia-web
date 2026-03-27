import { api, apiServer } from './fetch-client'

type SyncResult = { imported: number; skipped: number }

export type ReviewTokenInfo = {
  id: string
  name: string
  slug: string
  cover: string | null
}

export type SubmitReviewPayload = {
  rating: number
  title?: string
  comment?: string
}

export function getReviewTokenInfo(token: string) {
  return api.get<ReviewTokenInfo>(`/reviews/magic/${token}/info`)
}

export function getReviewTokenInfoServer(token: string) {
  return apiServer.get<ReviewTokenInfo>(`/reviews/magic/${token}/info`)
}

export function submitReviewFromToken(token: string, data: SubmitReviewPayload) {
  return api.post(`/reviews/magic/${token}`, data)
}

export function submitReview(
  listingType: 'experience' | 'stay',
  listingId: string,
  data: SubmitReviewPayload,
  headers: HeadersInit
) {
  const prefix = listingType === 'experience' ? 'experiences' : 'stays'
  return apiServer.post<void>(`/${prefix}/${listingId}/reviews`, data, { headers })
}

export function syncGoogleReviews(
  listingType: 'experience' | 'stay',
  listingId: string,
  headers: HeadersInit
) {
  const prefix = listingType === 'experience' ? 'experiences' : 'stays'
  return apiServer.post<SyncResult>(`/${prefix}/${listingId}/reviews/sync-google`, {}, { headers })
}
