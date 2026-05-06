import type { ExperienceItinerary } from '@/lib/schemas/entities/experience.entity.schema'
import { apiServer } from './fetch-client'

export function createItinerary(experienceId: string, data: FormData, headers: HeadersInit) {
  return apiServer.post<ExperienceItinerary>(`/experiences/${experienceId}/itinerary`, data, { headers })
}

export function updateItinerary(experienceId: string, itemId: string, data: FormData, headers: HeadersInit) {
  return apiServer.patch<ExperienceItinerary>(`/experiences/${experienceId}/itinerary/${itemId}`, data, {
    headers,
  })
}

export function deleteItinerary(experienceId: string, itemId: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/experiences/${experienceId}/itinerary/${itemId}`, { headers })
}

export function reorderItinerary(
  experienceId: string,
  items: { id: string; order: number }[],
  headers: HeadersInit
) {
  return apiServer.put<ExperienceItinerary[]>(
    `/experiences/${experienceId}/itinerary/reorder`,
    { items },
    { headers }
  )
}
