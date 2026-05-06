'use server'

import { createProductImage, deleteProductImage, reorderProductImages } from '@/lib/api/product-images'
import type { ProductImage } from '@/lib/schemas/entities/product.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function createProductImageAction(
  productId: string,
  formData: FormData
): Promise<ActionResult<ProductImage>> {
  try {
    const headers = await getAuthHeaders()
    const data = await createProductImage(productId, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/products/[id]', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteProductImageAction(productId: string, imageId: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteProductImage(productId, imageId, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/products/[id]', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function reorderProductImagesAction(
  productId: string,
  items: { id: string; order: number }[]
): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await reorderProductImages(productId, items, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/products/[id]', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
