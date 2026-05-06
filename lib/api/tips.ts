import type { Tip } from '@/lib/schemas/entities/tips.entity.schema'
import { apiServer } from './fetch-client'

export function createTip(data: FormData, headers: HeadersInit) {
  return apiServer.post<Tip>('/tips', data, { headers })
}

export function updateTip(tipId: string, data: FormData, headers: HeadersInit) {
  return apiServer.patch<Tip>(`/tips/${tipId}`, data, { headers })
}

export function deleteTip(tipId: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/tips/${tipId}`, { headers })
}
