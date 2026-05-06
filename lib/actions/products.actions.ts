'use server'

import { createProduct, updateProduct, deleteProduct } from '@/lib/api/products'
import type { Product } from '@/lib/schemas/entities/product.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function createProductAction(formData: FormData): Promise<ActionResult<Product>> {
  try {
    const headers = await getAuthHeaders()
    const data = await createProduct(formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/products', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateProductAction(id: string, formData: FormData): Promise<ActionResult<Product>> {
  try {
    const headers = await getAuthHeaders()
    const data = await updateProduct(id, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/products', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteProduct(id, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/products', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
