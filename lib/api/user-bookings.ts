import { apiServer } from './fetch-client'
import type { BookingPriceSnapshot, CreateBookingParticipant } from './bookings'

export type UserBookingListing = {
  id: string
  type: 'EXPERIENCE' | 'STAY'
  name: string
  slug: string
  cover: string | null
}

export type UserBookingTimeSlot = {
  id: string
  startTime: string
  endTime: string
} | null

export type UserBookingCounterProposal = {
  date: string
  timeSlotId?: string
  timeSlot?: { id: string; startTime: string; endTime: string } | null
}

export type UserBooking = {
  id: string
  status: string
  date: string
  dateTo?: string | null
  participants: CreateBookingParticipant[]
  totalPax: number
  message: string | null
  paymentStatus: string
  totalAmount: string
  depositAmount: string
  contactEmail: string
  contactPhone: string
  responseMessage: string | null
  counterProposals: UserBookingCounterProposal[] | null
  respondedAt: string | null
  createdAt: string
  updatedAt: string
  listing: UserBookingListing
  priceSnapshot: BookingPriceSnapshot | null
  timeSlot: UserBookingTimeSlot
  hasReview?: boolean
}

export function getUserBookings(headers: HeadersInit) {
  return apiServer.get<UserBooking[]>('/bookings/my', { headers })
}

export function cancelBooking(bookingId: string, headers: HeadersInit) {
  return apiServer.patch<UserBooking>(`/bookings/${bookingId}/cancel`, undefined, { headers })
}

export function acceptCounter(
  bookingId: string,
  proposal: { date: string; timeSlotId?: string },
  headers: HeadersInit
) {
  return apiServer.patch<UserBooking>(`/bookings/${bookingId}/accept-counter`, proposal, { headers })
}
