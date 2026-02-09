'use server'

import { createLocality, updateLocality, deleteLocality } from '@/lib/api/localities'
import type { Locality } from '@/lib/schemas/entities/locality.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function createLocalityAction(formData: FormData): Promise<ActionResult<Locality>> {
  try {
    const headers = await getAuthHeaders()
    const data = await createLocality(formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/locations', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateLocalityAction(id: string, formData: FormData): Promise<ActionResult<Locality>> {
  try {
    const headers = await getAuthHeaders()
    const data = await updateLocality(id, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/locations', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteLocalityAction(id: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteLocality(id, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/locations', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
