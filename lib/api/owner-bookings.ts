import { apiServer } from './fetch-client'
import type { AdminBooking, GetAdminBookingsParams, PaginatedAdminBookings } from './bookings'

export type OwnerDashboardStats = {
  year: number
  totalBookings: number
  confirmedCount: number
  pendingCount: number
  totalRevenue: string
  monthly: { month: number; count: number; revenue: string }[]
}

export type CounterProposal = {
  date: string
  timeSlotId?: string
}

export function getOwnerBookings(headers: HeadersInit, params?: GetAdminBookingsParams) {
  const queryParams: Record<string, string> = {}
  if (params?.status) queryParams.status = params.status
  if (params?.statusIn) queryParams.statusIn = params.statusIn
  if (params?.search) queryParams.search = params.search
  if (params?.limit) queryParams.limit = params.limit.toString()
  if (params?.cursor) queryParams.cursor = params.cursor
  return apiServer.get<PaginatedAdminBookings>('/bookings/owner', { params: queryParams, headers })
}

export function getOwnerStats(headers: HeadersInit, year?: number) {
  const params: Record<string, string> = {}
  if (year) params.year = year.toString()
  return apiServer.get<OwnerDashboardStats>('/bookings/owner/stats', { params, headers })
}

export function respondToBooking(
  bookingId: string,
  action: 'CONFIRM' | 'REJECT',
  responseMessage?: string,
  counterProposals?: CounterProposal[],
  headers?: HeadersInit
) {
  return apiServer.patch<AdminBooking>(
    `/bookings/${bookingId}/respond`,
    {
      action,
      responseMessage,
      counterProposals,
    },
    { headers }
  )
}
