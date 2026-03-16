'use server'

import {
  createStay,
  updateStay,
  deleteStay,
  setStayAvailability,
  setStayPricing,
  getStayById,
  setStayIcsUrl,
  syncStayIcs,
} from '@/lib/api/stays'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function createStayAction(formData: FormData): Promise<ActionResult<Stay>> {
  try {
    const headers = await getAuthHeaders()
    const data = await createStay(formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/stays', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateStayAction(id: string, formData: FormData): Promise<ActionResult<Stay>> {
  try {
    const headers = await getAuthHeaders()
    const data = await updateStay(id, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/stays', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteStayAction(id: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteStay(id, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/stays', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function setStayAvailabilityAction(
  stayId: string,
  data: Record<string, unknown>
): Promise<ActionResult<Stay>> {
  try {
    const headers = await getAuthHeaders()
    await setStayAvailability(stayId, data, headers)
    const stay = await getStayById(stayId)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/stays/[id]', 'page')
    return { success: true, data: stay }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function setStayIcsUrlAction(
  stayId: string,
  data: { icsUrl: string | null }
): Promise<ActionResult<Stay>> {
  try {
    const headers = await getAuthHeaders()
    await setStayIcsUrl(stayId, data, headers)
    const stay = await getStayById(stayId)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/stays/[id]', 'page')
    return { success: true, data: stay }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function syncStayIcsAction(stayId: string): Promise<ActionResult<Stay>> {
  try {
    const headers = await getAuthHeaders()
    await syncStayIcs(stayId, headers)
    const stay = await getStayById(stayId)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/stays/[id]', 'page')
    return { success: true, data: stay }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function setStayPricingAction(
  stayId: string,
  data: Record<string, unknown>
): Promise<ActionResult<Stay>> {
  try {
    const headers = await getAuthHeaders()
    await setStayPricing(stayId, data, headers)
    const stay = await getStayById(stayId)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/stays/[id]', 'page')
    return { success: true, data: stay }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
