import { apiServer } from './fetch-client'
import type { OwnerReview } from './owner-reviews'

export type ListingSearchResult = {
  id: string
  name: string
  cover: string | null
}

export type CreateAdminReviewBody = {
  listingId: string
  rating: number
  authorName: string
  authorImage?: string
  title?: string
  comment?: string
}

export type CreateAdminProductReviewBody = {
  productId: string
  rating: number
  authorName: string
  authorImage?: string
  title?: string
  comment?: string
}

export type UploadMediaResult = {
  url: string
  key: string
}

export type AdminReview = OwnerReview & {
  ownerName: string
}

export type GetAdminReviewsParams = {
  listingId?: string
  rating?: number
  hasReply?: boolean
  search?: string
  source?: 'PORTASICILIA' | 'GOOGLE'
  listingType?: 'experience' | 'stay' | 'product'
  sort?: 'newest' | 'oldest'
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
  if (filters?.sort) params.sort = filters.sort
  if (filters?.limit) params.limit = String(filters.limit)
  if (filters?.cursor) params.cursor = filters.cursor
  return apiServer.get<PaginatedAdminReviews>('/reviews/admin', { params, headers })
}

export type GetAdminProductReviewsParams = {
  productId?: string
  rating?: number
  hasReply?: boolean
  search?: string
  source?: 'PORTASICILIA' | 'GOOGLE'
  sort?: 'newest' | 'oldest'
  limit?: number
  cursor?: string
}

type RawProductReview = Omit<
  AdminReview,
  'listingId' | 'listingName' | 'listingCover' | 'listingType' | 'ownerName'
> & {
  product: { id: string; name: string; slug: string; cover: string | null }
}

export async function getAdminProductReviews(
  headers: HeadersInit,
  filters?: GetAdminProductReviewsParams
): Promise<PaginatedAdminReviews> {
  const params: Record<string, string> = {}
  if (filters?.productId) params.productId = filters.productId
  if (filters?.rating !== undefined) params.rating = String(filters.rating)
  if (filters?.hasReply !== undefined) params.hasReply = String(filters.hasReply)
  if (filters?.search) params.search = filters.search
  if (filters?.source) params.source = filters.source
  if (filters?.sort) params.sort = filters.sort
  if (filters?.limit) params.limit = String(filters.limit)
  if (filters?.cursor) params.cursor = filters.cursor
  const result = await apiServer.get<{ data: RawProductReview[]; nextCursor: string | null }>(
    '/product-reviews/admin',
    { params, headers }
  )
  return {
    nextCursor: result.nextCursor,
    data: result.data.map(({ product, ...rest }) => ({
      ...rest,
      listingId: product.id,
      listingName: product.name,
      listingCover: product.cover,
      listingType: 'product' as const,
      ownerName: '',
    })),
  }
}

type RawExperienceSearchItem = {
  id: string
  name: string
  cover: string | null
  [key: string]: unknown
}

type RawStaySearchItem = {
  id: string
  name: string
  cover: string | null
  [key: string]: unknown
}

type RawProductSearchItem = {
  id: string
  name: string
  cover: string | null
  [key: string]: unknown
}

export async function searchExperiencesAdmin(
  q: string,
  headers: HeadersInit
): Promise<ListingSearchResult[]> {
  const result = await apiServer.get<{ data: RawExperienceSearchItem[] } | RawExperienceSearchItem[]>(
    '/experiences/admin',
    { params: { search: q, limit: '20' }, headers }
  )
  const items = Array.isArray(result) ? result : result.data
  return items.map(({ id, name, cover }) => ({ id, name, cover: cover ?? null }))
}

export async function searchStaysAdmin(q: string, headers: HeadersInit): Promise<ListingSearchResult[]> {
  const result = await apiServer.get<{ data: RawStaySearchItem[] } | RawStaySearchItem[]>('/stays/admin', {
    params: { search: q, limit: '20' },
    headers,
  })
  const items = Array.isArray(result) ? result : result.data
  return items.map(({ id, name, cover }) => ({ id, name, cover: cover ?? null }))
}

export async function searchProductsAdmin(q: string, headers: HeadersInit): Promise<ListingSearchResult[]> {
  const result = await apiServer.get<RawProductSearchItem[]>('/products/admin', {
    params: { search: q, limit: '20' },
    headers,
  })
  const items = Array.isArray(result) ? result : []
  return items.map(({ id, name, cover }) => ({ id, name, cover: cover ?? null }))
}

export function createAdminReview(body: CreateAdminReviewBody, headers: HeadersInit) {
  return apiServer.post<AdminReview>('/reviews/admin', body, { headers })
}

export function createAdminProductReview(body: CreateAdminProductReviewBody, headers: HeadersInit) {
  return apiServer.post<AdminReview>('/product-reviews/admin', body, { headers })
}

export function uploadMedia(file: File, headers: HeadersInit) {
  const fd = new FormData()
  fd.append('file', file)
  return apiServer.post<UploadMediaResult>('/media/upload', fd, { headers })
}
