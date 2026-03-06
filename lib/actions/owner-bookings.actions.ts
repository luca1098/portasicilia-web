'use server'

import {
  getOwnerBookings,
  getOwnerStats,
  respondToBooking,
  type CounterProposal,
  type OwnerDashboardStats,
} from '@/lib/api/owner-bookings'
import { getExperienceById } from '@/lib/api/experiences'
import type { ExperienceTimeSlot } from '@/lib/schemas/entities/experience.entity.schema'
import type { AdminBooking, GetAdminBookingsParams, PaginatedAdminBookings } from '@/lib/api/bookings'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function getOwnerBookingsAction(
  params: GetAdminBookingsParams
): Promise<ActionResult<PaginatedAdminBookings>> {
  try {
    const headers = await getAuthHeaders()
    const result = await getOwnerBookings(headers, params)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function getOwnerStatsAction(): Promise<ActionResult<OwnerDashboardStats>> {
  try {
    const headers = await getAuthHeaders()
    const result = await getOwnerStats(headers)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function ownerRespondBookingAction(
  bookingId: string,
  action: 'CONFIRM' | 'REJECT',
  counterProposals?: CounterProposal[],
  responseMessage?: string
): Promise<ActionResult<AdminBooking>> {
  try {
    const headers = await getAuthHeaders()
    const actualAction = counterProposals?.length ? ('REJECT' as const) : action
    const data = await respondToBooking(
      bookingId,
      actualAction,
      responseMessage || undefined,
      counterProposals,
      headers
    )
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function getExperienceTimeSlotsAction(
  experienceId: string
): Promise<ActionResult<ExperienceTimeSlot[]>> {
  try {
    const experience = await getExperienceById(experienceId)
    return { success: true, data: experience.timeSlots ?? [] }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
