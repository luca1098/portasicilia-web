'use server'

import { createShopCategory, updateShopCategory, deleteShopCategory } from '@/lib/api/products'
import type { ShopCategory } from '@/lib/schemas/entities/product.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function createShopCategoryAction(formData: FormData): Promise<ActionResult<ShopCategory>> {
  try {
    const headers = await getAuthHeaders()
    const data = await createShopCategory(formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/shop-categories', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateShopCategoryAction(
  id: string,
  formData: FormData
): Promise<ActionResult<ShopCategory>> {
  try {
    const headers = await getAuthHeaders()
    const data = await updateShopCategory(id, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/shop-categories', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteShopCategoryAction(id: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteShopCategory(id, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/shop-categories', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
