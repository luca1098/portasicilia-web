import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import { apiServer } from './fetch-client'

type PaginatedExperiences = {
  data: Experience[]
  nextCursor: string | null
}

type GetExperiencesParams = {
  localityId?: string
  limit?: number
  cursor?: string
}

export async function getExperiences(params?: GetExperiencesParams) {
  const { localityId, limit, cursor } = params || {}
  const queryParams: Record<string, string> = {}
  if (localityId) queryParams.localityId = localityId
  if (limit) queryParams.limit = limit.toString()
  if (cursor) queryParams.cursor = cursor
  return apiServer.get<PaginatedExperiences>('/experiences', { params: queryParams })
}

export function getExperienceById(id: string) {
  return apiServer.get<Experience>(`/experiences/${id}`)
}

export function getExperienceBySlug(slug: string) {
  return apiServer.get<Experience>(`/experiences/slug/${slug}`)
}

export function createExperience(data: FormData, headers: HeadersInit) {
  return apiServer.post<Experience>('/experiences', data, { headers })
}

export function updateExperience(id: string, data: FormData, headers: HeadersInit) {
  return apiServer.patch<Experience>(`/experiences/${id}`, data, { headers })
}

export function deleteExperience(id: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/experiences/${id}`, { headers })
}
