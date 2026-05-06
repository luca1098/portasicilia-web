import type { ExperienceTimeSlot } from '@/lib/schemas/entities/experience.entity.schema'
import { apiServer } from './fetch-client'

export function createTimeSlot(experienceId: string, data: unknown, headers: HeadersInit) {
  return apiServer.post<ExperienceTimeSlot>(`/experiences/${experienceId}/time-slots`, data, { headers })
}

export function deleteTimeSlot(experienceId: string, slotId: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/experiences/${experienceId}/time-slots/${slotId}`, { headers })
}
