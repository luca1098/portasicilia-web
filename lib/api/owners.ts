import type { Owner } from '@/lib/schemas/entities/owner.entity.schema'
import { apiServer } from './fetch-client'

type SearchOwnersParams = {
  name?: string
  limit?: number
}

export async function searchOwners(params?: SearchOwnersParams, headers?: HeadersInit) {
  const { name, limit = 10 } = params || {}
  const queryParams: Record<string, string> = {}
  if (name) {
    queryParams.name = name
  }
  if (limit) {
    queryParams.limit = limit.toString()
  }
  return apiServer.get<Owner[]>('/users/owners', { params: queryParams, headers })
}

export function getOwnerById(id: string, headers?: HeadersInit) {
  return apiServer.get<Owner>(`/users/owners/${id}`, { headers })
}
