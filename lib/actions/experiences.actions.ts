'use server'

import {
  createExperience,
  updateExperience,
  deleteExperience,
  setExperienceSchedule,
  setExperiencePricing,
  getExperienceById,
} from '@/lib/api/experiences'
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

export async function setScheduleAction(
  experienceId: string,
  data: Record<string, unknown>
): Promise<ActionResult<Experience>> {
  try {
    const headers = await getAuthHeaders()
    const result = await setExperienceSchedule(experienceId, data, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/experiences/[id]', 'page')
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function setPricingAction(
  experienceId: string,
  data: Record<string, unknown>
): Promise<ActionResult<Experience>> {
  try {
    const headers = await getAuthHeaders()
    await setExperiencePricing(experienceId, data, headers)
    // Re-fetch the full experience since the pricing endpoint returns a PriceList, not an Experience
    const experience = await getExperienceById(experienceId)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/experiences/[id]', 'page')
    return { success: true, data: experience }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
