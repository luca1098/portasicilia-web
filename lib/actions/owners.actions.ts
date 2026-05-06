'use server'

import { searchOwners } from '@/lib/api/owners'
import type { Owner } from '@/lib/schemas/entities/owner.entity.schema'
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
