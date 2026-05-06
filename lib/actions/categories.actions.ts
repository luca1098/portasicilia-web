'use server'

import { createCategory, updateCategory, deleteCategory } from '@/lib/api/categories'
import type { Category } from '@/lib/schemas/entities/category.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function createCategoryAction(formData: FormData): Promise<ActionResult<Category>> {
  try {
    const headers = await getAuthHeaders()
    const data = await createCategory(formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/categories', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateCategoryAction(id: string, formData: FormData): Promise<ActionResult<Category>> {
  try {
    const headers = await getAuthHeaders()
    const data = await updateCategory(id, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/categories', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteCategory(id, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/categories', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
