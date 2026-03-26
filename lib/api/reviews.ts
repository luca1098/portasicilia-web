import { apiServer } from './fetch-client'

type SyncResult = { imported: number; skipped: number }

export function syncGoogleReviews(
  listingType: 'experience' | 'stay',
  listingId: string,
  headers: HeadersInit
) {
  const prefix = listingType === 'experience' ? 'experiences' : 'stays'
  return apiServer.post<SyncResult>(`/${prefix}/${listingId}/reviews/sync-google`, {}, { headers })
}
