import type { Locality } from '@/lib/schemas/entities/locality.entity.schema'
import { apiServer } from './fetch-client'

export type LocalityCard = {
  id: string
  name: string
  slug: string
  cover: string | null
  totalActivities: number
  totalStays: number
}

type PaginatedLocalityCards = {
  data: LocalityCard[]
  nextCursor: string | null
}

type GetLocalitiesParams = {
  limit?: number
}
export async function getLocalities(params?: GetLocalitiesParams) {
  const { limit } = params || {}
  const queryParams: Record<string, string> = {}
  if (limit) {
    queryParams.limit = limit.toString()
  }
  return apiServer.get<Locality[]>('/localities', { params: queryParams })
}

type GetLocalityCardsParams = {
  highlighted?: boolean
  limit?: number
  cursor?: string
}

export async function getLocalityCards(params?: GetLocalityCardsParams) {
  const { highlighted, limit, cursor } = params || {}
  const queryParams: Record<string, string> = {}
  if (highlighted !== undefined) queryParams.highlighted = highlighted.toString()
  if (limit) queryParams.limit = limit.toString()
  if (cursor) queryParams.cursor = cursor
  return apiServer.get<PaginatedLocalityCards>('/localities/cards', { params: queryParams })
}

export function getLocalityById(id: string) {
  return apiServer.get<Locality>(`/localities/${id}`)
}

export function getLocalityBySlug(slug: string) {
  return apiServer.get<Locality>(`/localities/slug/${slug}`)
}

export function createLocality(data: FormData, headers: HeadersInit) {
  return apiServer.post<Locality>('/localities', data, { headers })
}

export function updateLocality(id: string, data: FormData, headers: HeadersInit) {
  return apiServer.patch<Locality>(`/localities/${id}`, data, { headers })
}

export function deleteLocality(id: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/localities/${id}`, { headers })
}
