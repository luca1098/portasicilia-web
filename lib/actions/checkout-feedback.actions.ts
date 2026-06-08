'use server'

import {
  submitCheckoutFeedback,
  getCheckoutFeedbacks,
  type CreateCheckoutFeedbackBody,
  type GetCheckoutFeedbacksParams,
  type PaginatedCheckoutFeedbacks,
} from '@/lib/api/checkout-feedback'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function submitCheckoutFeedbackAction(
  body: CreateCheckoutFeedbackBody
): Promise<ActionResult<{ id: string }>> {
  try {
    const headers = await getAuthHeaders()
    const result = await submitCheckoutFeedback(body, headers)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function getCheckoutFeedbacksAction(
  filters?: GetCheckoutFeedbacksParams
): Promise<ActionResult<PaginatedCheckoutFeedbacks>> {
  try {
    const headers = await getAuthHeaders()
    const result = await getCheckoutFeedbacks(headers, filters)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
