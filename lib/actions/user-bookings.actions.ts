'use server'

import { getUserBookings, cancelBooking, acceptCounter, type UserBooking } from '@/lib/api/user-bookings'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function getUserBookingsAction(): Promise<ActionResult<UserBooking[]>> {
  try {
    const headers = await getAuthHeaders()
    const result = await getUserBookings(headers)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function cancelBookingAction(bookingId: string): Promise<ActionResult<UserBooking>> {
  try {
    const headers = await getAuthHeaders()
    const result = await cancelBooking(bookingId, headers)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function acceptCounterAction(
  bookingId: string,
  proposal: { date: string; timeSlotId?: string }
): Promise<ActionResult<UserBooking>> {
  try {
    const headers = await getAuthHeaders()
    const result = await acceptCounter(bookingId, proposal, headers)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
