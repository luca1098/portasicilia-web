'use server'

import { createBooking, type CreateBookingDto, type BookingResponse } from '@/lib/api/bookings'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function createBookingAction(data: CreateBookingDto): Promise<ActionResult<BookingResponse>> {
  try {
    const headers = await getAuthHeaders()
    const booking = await createBooking(data, headers)
    return { success: true, data: booking }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
