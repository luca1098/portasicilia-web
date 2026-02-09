'use server'

import { createTip, updateTip, deleteTip } from '@/lib/api/tips'
import type { Tip } from '@/lib/schemas/entities/tips.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function createTipAction(localityId: string, formData: FormData): Promise<ActionResult<Tip>> {
  try {
    const headers = await getAuthHeaders()
    formData.append('localityId', localityId)
    const data = await createTip(formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/locations/[id]', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateTipAction(tipId: string, formData: FormData): Promise<ActionResult<Tip>> {
  try {
    const headers = await getAuthHeaders()
    const data = await updateTip(tipId, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/locations/[id]', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteTipAction(localityId: string, tipId: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteTip(tipId, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/locations/[id]', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
