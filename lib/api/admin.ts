import { apiServer } from './fetch-client'

export type AdminDashboardStats = {
  locations: number
  experiences: number
  stays: number
  users: number
  owners: number
}

export function getAdminStats(headers: HeadersInit) {
  return apiServer.get<AdminDashboardStats>('/admin/stats', { headers })
}
