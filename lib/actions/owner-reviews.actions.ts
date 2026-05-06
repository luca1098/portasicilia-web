'use server'

import {
  getOwnerReviews,
  replyToReview,
  type GetOwnerReviewsParams,
  type PaginatedOwnerReviews,
} from '@/lib/api/owner-reviews'
import type { Review } from '@/lib/schemas/entities/experience.entity.schema'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function getOwnerReviewsAction(
  filters?: GetOwnerReviewsParams
): Promise<ActionResult<PaginatedOwnerReviews>> {
  try {
    const headers = await getAuthHeaders()
    const result = await getOwnerReviews(headers, filters)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function replyToReviewAction(
  listingType: 'experience' | 'stay',
  listingId: string,
  reviewId: string,
  reply: string
): Promise<ActionResult<Review>> {
  try {
    const headers = await getAuthHeaders()
    const result = await replyToReview(listingType, listingId, reviewId, reply, headers)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
