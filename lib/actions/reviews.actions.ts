'use server'

import { syncGoogleReviews, submitReview, type SubmitReviewPayload } from '@/lib/api/reviews'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function submitReviewAction(
  listingType: 'experience' | 'stay',
  listingId: string,
  data: SubmitReviewPayload
): Promise<ActionResult<void>> {
  try {
    const headers = await getAuthHeaders()
    await submitReview(listingType, listingId, data, headers)
    revalidatePath('/[lang]/(listings)/experiences/[slug]', 'page')
    revalidatePath('/[lang]/(listings)/stays/[slug]', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function syncGoogleReviewsAction(
  listingType: 'experience' | 'stay',
  listingId: string
): Promise<ActionResult<{ imported: number; skipped: number }>> {
  try {
    const headers = await getAuthHeaders()
    const result = await syncGoogleReviews(listingType, listingId, headers)
    revalidatePath('/[lang]/(listings)/experiences/[slug]', 'page')
    revalidatePath('/[lang]/(listings)/stays/[slug]', 'page')
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
