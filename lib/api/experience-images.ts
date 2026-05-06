import type { ExperienceImage } from '@/lib/schemas/entities/experience.entity.schema'
import { apiServer } from './fetch-client'

export function createImage(experienceId: string, data: FormData, headers: HeadersInit) {
  return apiServer.post<ExperienceImage>(`/experiences/${experienceId}/images`, data, { headers })
}

export function deleteImage(experienceId: string, imageId: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/experiences/${experienceId}/images/${imageId}`, { headers })
}

export function reorderImages(
  experienceId: string,
  items: { id: string; order: number }[],
  headers: HeadersInit
) {
  return apiServer.put<ExperienceImage[]>(
    `/experiences/${experienceId}/images/reorder`,
    { items },
    { headers }
  )
}
