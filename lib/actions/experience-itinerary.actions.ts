'use server'

import {
  createItinerary,
  updateItinerary,
  deleteItinerary,
  reorderItinerary,
} from '@/lib/api/experience-itinerary'
import type { ExperienceItinerary } from '@/lib/schemas/entities/experience.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function createItineraryAction(
  experienceId: string,
  formData: FormData
): Promise<ActionResult<ExperienceItinerary>> {
  try {
    const headers = await getAuthHeaders()
    const data = await createItinerary(experienceId, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/experiences/[id]', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateItineraryAction(
  experienceId: string,
  itemId: string,
  formData: FormData
): Promise<ActionResult<ExperienceItinerary>> {
  try {
    const headers = await getAuthHeaders()
    const data = await updateItinerary(experienceId, itemId, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/experiences/[id]', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteItineraryAction(experienceId: string, itemId: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteItinerary(experienceId, itemId, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/experiences/[id]', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function reorderItineraryAction(
  experienceId: string,
  items: { id: string; order: number }[]
): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await reorderItinerary(experienceId, items, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/experiences/[id]', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
