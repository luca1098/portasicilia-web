'use server'

import { createExperience, updateExperience, deleteExperience } from '@/lib/api/experiences'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function createExperienceAction(formData: FormData): Promise<ActionResult<Experience>> {
  try {
    const headers = await getAuthHeaders()
    const data = await createExperience(formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/experiences', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateExperienceAction(
  id: string,
  formData: FormData
): Promise<ActionResult<Experience>> {
  try {
    const headers = await getAuthHeaders()
    const data = await updateExperience(id, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/experiences', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteExperienceAction(id: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteExperience(id, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/experiences', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
