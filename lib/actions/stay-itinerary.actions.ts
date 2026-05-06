'use server'

import { createItinerary, updateItinerary, deleteItinerary, reorderItinerary } from '@/lib/api/stay-itinerary'
import type { ExperienceItinerary } from '@/lib/schemas/entities/experience.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function createStayItineraryAction(
  stayId: string,
  formData: FormData
): Promise<ActionResult<ExperienceItinerary>> {
  try {
    const headers = await getAuthHeaders()
    const data = await createItinerary(stayId, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/stays/[id]', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateStayItineraryAction(
  stayId: string,
  itemId: string,
  formData: FormData
): Promise<ActionResult<ExperienceItinerary>> {
  try {
    const headers = await getAuthHeaders()
    const data = await updateItinerary(stayId, itemId, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/stays/[id]', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteStayItineraryAction(stayId: string, itemId: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteItinerary(stayId, itemId, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/stays/[id]', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function reorderStayItineraryAction(
  stayId: string,
  items: { id: string; order: number }[]
): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await reorderItinerary(stayId, items, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/stays/[id]', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
