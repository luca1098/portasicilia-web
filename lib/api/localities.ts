import type { Locality } from '@/lib/schemas/entities/locality.entity.schema'
import { apiServer } from './fetch-client'

type GetLocalitiesParams = {
  limit?: number
}
export async function getLocalities(params?: GetLocalitiesParams) {
  const { limit } = params || {}
  const queryParams: Record<string, string> = {}
  if (limit) {
    queryParams.limit = limit.toString()
  }
  const data = await apiServer.get<Locality[]>('/localities', { params: queryParams })
  setTimeout(() => {
    return data
  }, 10000)
  return data
}

export function getLocalityById(id: string) {
  return apiServer.get<Locality>(`/localities/${id}`)
}
