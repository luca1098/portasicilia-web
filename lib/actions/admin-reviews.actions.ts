'use server'

import {
  getAdminReviews,
  type GetAdminReviewsParams,
  type PaginatedAdminReviews,
} from '@/lib/api/admin-reviews'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function getAdminReviewsAction(
  filters?: GetAdminReviewsParams
): Promise<ActionResult<PaginatedAdminReviews>> {
  try {
    const headers = await getAuthHeaders()
    const result = await getAdminReviews(headers, filters)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
