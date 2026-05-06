import type { ExperienceImage } from '@/lib/schemas/entities/experience.entity.schema'
import { apiServer } from './fetch-client'

export function createImage(stayId: string, data: FormData, headers: HeadersInit) {
  return apiServer.post<ExperienceImage>(`/stays/${stayId}/images`, data, { headers })
}

export function deleteImage(stayId: string, imageId: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/stays/${stayId}/images/${imageId}`, { headers })
}

export function reorderImages(stayId: string, items: { id: string; order: number }[], headers: HeadersInit) {
  return apiServer.put<ExperienceImage[]>(`/stays/${stayId}/images/reorder`, { items }, { headers })
}
