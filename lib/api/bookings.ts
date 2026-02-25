import { apiServer } from './fetch-client'

export type CreateBookingParticipant = {
  type: 'ADULT' | 'CHILD' | 'INFANT' | 'SENIOR' | 'STUDENT' | 'GROUP'
  quantity: number
}

export type CreateBookingBilling = {
  firstName: string
  lastName: string
  street: string
  city: string
  zipCode: string
  province: string
  country?: string
  fiscalCode?: string
  vatNumber?: string
  billingType: 'PRIVATE' | 'COMPANY'
  companyName?: string
  recipientCode?: string
  pecEmail?: string
}

export type CreateBookingAsset = {
  type: string
  quantity: number
}

export type CreateBookingDto = {
  experienceId: string
  date: string
  timeSlotId?: string
  participants?: CreateBookingParticipant[]
  assets?: CreateBookingAsset[]
  contactEmail: string
  contactPhone: string
  billing: CreateBookingBilling
  message?: string
}

export type BookingLineItem = {
  tierType: string
  label: string
  quantity: number
  effectiveUnitPrice: string
  subtotal: string
}

export type BookingPriceSnapshot = {
  lineItems: BookingLineItem[]
  total: string
  currency: string
}

export type BookingResponse = {
  id: string
  status: string
  date: string
  timeSlotId?: string
  participants: CreateBookingParticipant[]
  totalPax: number
  contactEmail: string
  contactPhone: string
  experience: { id: string; name: string; slug: string }
  priceSnapshot: BookingPriceSnapshot
}

export function createBooking(data: CreateBookingDto, headers: HeadersInit) {
  return apiServer.post<BookingResponse>('/bookings', data, { headers })
}
