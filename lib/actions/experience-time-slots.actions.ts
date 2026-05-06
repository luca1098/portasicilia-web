'use server'

import { createTimeSlot, deleteTimeSlot } from '@/lib/api/experience-time-slots'
import type { ExperienceTimeSlot } from '@/lib/schemas/entities/experience.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

const REVALIDATE_PATH = '/[lang]/(dashboard)/dashboard/admin/experiences/[id]'

export async function createTimeSlotAction(
  experienceId: string,
  data: Record<string, unknown>
): Promise<ActionResult<ExperienceTimeSlot>> {
  try {
    const headers = await getAuthHeaders()
    const result = await createTimeSlot(experienceId, data, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteTimeSlotAction(experienceId: string, slotId: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteTimeSlot(experienceId, slotId, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
