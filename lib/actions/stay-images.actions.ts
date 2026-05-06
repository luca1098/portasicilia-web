'use server'

import { createImage, deleteImage, reorderImages } from '@/lib/api/stay-images'
import type { ExperienceImage } from '@/lib/schemas/entities/experience.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function createStayImageAction(
  stayId: string,
  formData: FormData
): Promise<ActionResult<ExperienceImage>> {
  try {
    const headers = await getAuthHeaders()
    const data = await createImage(stayId, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/stays/[id]', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteStayImageAction(stayId: string, imageId: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteImage(stayId, imageId, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/stays/[id]', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function reorderStayImagesAction(
  stayId: string,
  items: { id: string; order: number }[]
): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await reorderImages(stayId, items, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/stays/[id]', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
