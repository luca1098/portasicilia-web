import type { ExperienceItinerary } from '@/lib/schemas/entities/experience.entity.schema'
import { apiServer } from './fetch-client'

export function createItinerary(stayId: string, data: FormData, headers: HeadersInit) {
  return apiServer.post<ExperienceItinerary>(`/stays/${stayId}/itinerary`, data, { headers })
}

export function updateItinerary(stayId: string, itemId: string, data: FormData, headers: HeadersInit) {
  return apiServer.patch<ExperienceItinerary>(`/stays/${stayId}/itinerary/${itemId}`, data, {
    headers,
  })
}

export function deleteItinerary(stayId: string, itemId: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/stays/${stayId}/itinerary/${itemId}`, { headers })
}

export function reorderItinerary(
  stayId: string,
  items: { id: string; order: number }[],
  headers: HeadersInit
) {
  return apiServer.put<ExperienceItinerary[]>(`/stays/${stayId}/itinerary/reorder`, { items }, { headers })
}
