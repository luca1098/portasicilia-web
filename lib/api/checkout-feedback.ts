import { apiServer } from './fetch-client'

export type CheckoutFeedbackUser = {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  avatar: string | null
}

export type CheckoutFeedback = {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: CheckoutFeedbackUser
}

export type PaginatedCheckoutFeedbacks = {
  data: CheckoutFeedback[]
  nextCursor: string | null
}

export type CheckoutFeedbackStats = {
  total: number
  averageRating: number
  byRating: Record<string, number>
}

export type CreateCheckoutFeedbackBody = {
  rating: number
  comment?: string
}

export type GetCheckoutFeedbacksParams = {
  rating?: number
  limit?: number
  cursor?: string
}

export function submitCheckoutFeedback(body: CreateCheckoutFeedbackBody, headers: HeadersInit) {
  return apiServer.post<{ id: string }>('/checkout-feedback', body, { headers })
}

export function getCheckoutFeedbacks(headers: HeadersInit, filters?: GetCheckoutFeedbacksParams) {
  const params: Record<string, string> = {}
  if (filters?.rating !== undefined) params.rating = String(filters.rating)
  if (filters?.limit) params.limit = String(filters.limit)
  if (filters?.cursor) params.cursor = filters.cursor
  return apiServer.get<PaginatedCheckoutFeedbacks>('/checkout-feedback/admin', { params, headers })
}

export function getCheckoutFeedbackStats(headers: HeadersInit) {
  return apiServer.get<CheckoutFeedbackStats>('/checkout-feedback/admin/stats', { headers })
}
