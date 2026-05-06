'use server'

import { createImage, deleteImage, reorderImages } from '@/lib/api/experience-images'
import type { ExperienceImage } from '@/lib/schemas/entities/experience.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function createImageAction(
  experienceId: string,
  formData: FormData
): Promise<ActionResult<ExperienceImage>> {
  try {
    const headers = await getAuthHeaders()
    const data = await createImage(experienceId, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/experiences/[id]', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteImageAction(experienceId: string, imageId: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteImage(experienceId, imageId, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/experiences/[id]', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function reorderImagesAction(
  experienceId: string,
  items: { id: string; order: number }[]
): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await reorderImages(experienceId, items, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/experiences/[id]', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
