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

type GetExperiencesAdminParams = {
  ownerId?: string
  status?: string
  limit?: number
  cursor?: string
}

export async function getExperiencesAdmin(headers: HeadersInit, params?: GetExperiencesAdminParams) {
  const { ownerId, status, limit, cursor } = params || {}
  const queryParams: Record<string, string> = {}
  if (ownerId) queryParams.ownerId = ownerId
  if (status) queryParams.status = status
  if (limit) queryParams.limit = limit.toString()
  if (cursor) queryParams.cursor = cursor
  return apiServer.get<PaginatedExperiences>('/experiences/admin', { params: queryParams, headers })
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

export function setExperienceSchedule(id: string, data: unknown, headers: HeadersInit) {
  return apiServer.put<Experience>(`/experiences/${id}/schedule`, data, { headers })
}

export function setExperiencePricing(id: string, data: unknown, headers: HeadersInit) {
  return apiServer.put<unknown>(`/experiences/${id}/pricing`, data, { headers })
}
