'use server'

import {
  getAdminReviews,
  getAdminProductReviews,
  createAdminReview,
  createAdminProductReview,
  uploadMedia,
  searchExperiencesAdmin,
  searchStaysAdmin,
  searchProductsAdmin,
  type GetAdminReviewsParams,
  type GetAdminProductReviewsParams,
  type PaginatedAdminReviews,
  type AdminReview,
  type ListingSearchResult,
} from '@/lib/api/admin-reviews'
import { type ActionResult, getAuthHeaders } from './action.types'
import { revalidatePath } from 'next/cache'

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

export async function getAdminProductReviewsAction(
  filters?: GetAdminProductReviewsParams
): Promise<ActionResult<PaginatedAdminReviews>> {
  try {
    const headers = await getAuthHeaders()
    const result = await getAdminProductReviews(headers, filters)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

type CreateAdminReviewPayload = {
  listingType: 'experience' | 'stay'
  listingId: string
  rating: number
  authorName: string
  authorImage?: File | string | null
  title?: string
  comment?: string
}

type CreateAdminProductReviewPayload = {
  productId: string
  rating: number
  authorName: string
  authorImage?: File | string | null
  title?: string
  comment?: string
}

export async function createAdminReviewAction(
  payload: CreateAdminReviewPayload
): Promise<ActionResult<AdminReview>> {
  try {
    const headers = await getAuthHeaders()

    let authorImageUrl: string | undefined
    if (payload.authorImage instanceof File) {
      const uploaded = await uploadMedia(payload.authorImage, headers)
      authorImageUrl = uploaded.url
    } else if (typeof payload.authorImage === 'string') {
      authorImageUrl = payload.authorImage
    }

    const data = await createAdminReview(
      {
        listingId: payload.listingId,
        rating: payload.rating,
        authorName: payload.authorName,
        ...(authorImageUrl && { authorImage: authorImageUrl }),
        ...(payload.title && { title: payload.title }),
        ...(payload.comment && { comment: payload.comment }),
      },
      headers
    )

    revalidatePath('/[lang]/(dashboard)/dashboard/admin/reviews', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function createAdminProductReviewAction(
  payload: CreateAdminProductReviewPayload
): Promise<ActionResult<AdminReview>> {
  try {
    const headers = await getAuthHeaders()

    let authorImageUrl: string | undefined
    if (payload.authorImage instanceof File) {
      const uploaded = await uploadMedia(payload.authorImage, headers)
      authorImageUrl = uploaded.url
    } else if (typeof payload.authorImage === 'string') {
      authorImageUrl = payload.authorImage
    }

    const data = await createAdminProductReview(
      {
        productId: payload.productId,
        rating: payload.rating,
        authorName: payload.authorName,
        ...(authorImageUrl && { authorImage: authorImageUrl }),
        ...(payload.title && { title: payload.title }),
        ...(payload.comment && { comment: payload.comment }),
      },
      headers
    )

    revalidatePath('/[lang]/(dashboard)/dashboard/admin/shop-reviews', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function searchExperiencesAdminAction(q: string): Promise<ActionResult<ListingSearchResult[]>> {
  try {
    const headers = await getAuthHeaders()
    const data = await searchExperiencesAdmin(q, headers)
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function searchStaysAdminAction(q: string): Promise<ActionResult<ListingSearchResult[]>> {
  try {
    const headers = await getAuthHeaders()
    const data = await searchStaysAdmin(q, headers)
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function searchProductsAdminAction(q: string): Promise<ActionResult<ListingSearchResult[]>> {
  try {
    const headers = await getAuthHeaders()
    const data = await searchProductsAdmin(q, headers)
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
