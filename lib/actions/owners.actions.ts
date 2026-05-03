'use server'

import { searchOwners, createAdminOwner, updateAdminOwner, deleteAdminOwner } from '@/lib/api/owners'
import type { Owner, AdminOwner } from '@/lib/schemas/entities/owner.entity.schema'
import type { CreateAdminOwnerBody, UpdateAdminOwnerBody } from '@/lib/api/owners'
import { revalidatePath } from 'next/cache'
import { getAuthHeaders, type ActionResult } from './action.types'

export async function searchOwnersAction(name: string): Promise<ActionResult<Owner[]>> {
  try {
    const headers = await getAuthHeaders()
    const data = await searchOwners({ name, limit: 10 }, headers)
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function createAdminOwnerAction(body: CreateAdminOwnerBody): Promise<ActionResult<AdminOwner>> {
  try {
    const headers = await getAuthHeaders()
    const data = await createAdminOwner(body, headers)
    revalidatePath('/[lang]/dashboard/admin/owners', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateAdminOwnerAction(
  id: string,
  body: UpdateAdminOwnerBody
): Promise<ActionResult<AdminOwner>> {
  try {
    const headers = await getAuthHeaders()
    const data = await updateAdminOwner(id, body, headers)
    revalidatePath('/[lang]/dashboard/admin/owners', 'page')
    revalidatePath(`/[lang]/(dashboard)/dashboard/admin/owners/${id}`, 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteAdminOwnerAction(id: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteAdminOwner(id, headers)
    revalidatePath('/[lang]/dashboard/admin/owners', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
