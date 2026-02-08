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

export function getExperienceBySlug(slug: string) {
  return apiServer.get<Experience>(`/experiences/slug/${slug}`)
}
