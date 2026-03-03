'use server'

import {
  checkoutBooking,
  confirmBooking,
  type CreateBookingDto,
  type CheckoutResponse,
  type BookingResponse,
} from '@/lib/api/bookings'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function checkoutAction(data: CreateBookingDto): Promise<ActionResult<CheckoutResponse>> {
  try {
    const headers = await getAuthHeaders()
    const result = await checkoutBooking(data, headers)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function confirmBookingAction(paymentIntentId: string): Promise<ActionResult<BookingResponse>> {
  try {
    const headers = await getAuthHeaders()
    const booking = await confirmBooking(paymentIntentId, headers)
    return { success: true, data: booking }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
