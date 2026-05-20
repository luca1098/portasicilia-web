import type { AdminBooking } from '@/lib/api/bookings'

export function isBookingPast(booking: Pick<AdminBooking, 'date' | 'dateTo'>) {
  const referenceDate = booking.dateTo ?? booking.date
  return new Date(referenceDate) < new Date(new Date().toDateString())
}

export function isBookingCancellable(booking: AdminBooking) {
  return booking.status === 'CONFIRMED' && !isBookingPast(booking)
}

export function shouldObscurePersonalData(booking: AdminBooking) {
  return booking.status === 'PENDING_APPROVAL' || booking.status === 'REJECTED'
}
