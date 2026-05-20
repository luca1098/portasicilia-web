import { api, apiServer } from './fetch-client'

export type CreateBookingParticipant = {
  type: 'ADULT' | 'CHILD' | 'INFANT' | 'SENIOR' | 'STUDENT' | 'GROUP'
  quantity: number
}

export type CreateBookingBilling = {
  firstName: string
  lastName: string
  billingType: 'PRIVATE' | 'COMPANY'
  street?: string
  city?: string
  zipCode?: string
  province?: string
  country?: string
  fiscalCode?: string
  vatNumber?: string
  companyName?: string
  recipientCode?: string
  pecEmail?: string
}

export type CreateBookingAsset = {
  type: string
  quantity: number
}

export type CreateBookingDto = {
  listingId: string
  date: string
  dateTo?: string
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

export type CheckoutResponse = {
  clientSecret: string
  depositAmount: string
  breakdown: {
    lineItems: BookingLineItem[]
    subtotal: string
    total: string
    commissionAmount: string
    currency: string
  }
}

export type BookingResponse = {
  id: string
  status: string
  date: string
  dateTo?: string | null
  timeSlotId?: string
  participants: CreateBookingParticipant[]
  totalPax: number
  totalAmount: string
  depositAmount: string
  contactEmail: string
  contactPhone: string
  listing: { id: string; name: string; slug: string }
  priceSnapshot: BookingPriceSnapshot
}

export function checkoutBooking(data: CreateBookingDto, headers: HeadersInit) {
  return apiServer.post<CheckoutResponse>('/bookings/checkout', data, { headers })
}

export function confirmBooking(paymentIntentId: string, headers: HeadersInit) {
  return apiServer.post<BookingResponse>('/bookings/confirm', { paymentIntentId }, { headers })
}

// Admin types and functions

export type AdminBookingUser = {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  avatar: string | null
}

export type AdminBookingListing = {
  id: string
  type: 'EXPERIENCE' | 'STAY'
  name: string
  slug: string
  cover: string | null
  owner: { id: string; firstName: string | null; lastName: string | null }
}

export type AdminBooking = {
  id: string
  status: string
  date: string
  dateTo?: string | null
  totalPax: number
  totalAmount: string
  depositAmount: string
  participants: CreateBookingParticipant[]
  contactEmail: string
  contactPhone: string
  paymentStatus: string
  stripePaymentIntentId: string | null
  createdAt: string
  user: AdminBookingUser
  listing: AdminBookingListing
  timeSlot: { id: string; startTime: string; endTime: string } | null
  priceSnapshot: BookingPriceSnapshot | null
}

export type PaginatedAdminBookings = {
  data: AdminBooking[]
  nextCursor: string | null
}

export type GetAdminBookingsParams = {
  status?: string
  statusIn?: string
  type?: string
  dateFrom?: string
  dateTo?: string
  search?: string
  limit?: number
  cursor?: string
}

export function getAdminBookings(headers: HeadersInit, params?: GetAdminBookingsParams) {
  const queryParams: Record<string, string> = {}
  if (params?.status) queryParams.status = params.status
  if (params?.statusIn) queryParams.statusIn = params.statusIn
  if (params?.type) queryParams.type = params.type
  if (params?.dateFrom) queryParams.dateFrom = params.dateFrom
  if (params?.dateTo) queryParams.dateTo = params.dateTo
  if (params?.search) queryParams.search = params.search
  if (params?.limit) queryParams.limit = params.limit.toString()
  if (params?.cursor) queryParams.cursor = params.cursor
  return apiServer.get<PaginatedAdminBookings>('/bookings/admin', { params: queryParams, headers })
}

function authOpts(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export function refundBooking(bookingId: string, token: string) {
  return api.post<AdminBooking>(`/bookings/${bookingId}/refund`, undefined, authOpts(token))
}

export type RespondBookingDto = {
  action: 'CONFIRM' | 'REJECT'
  responseMessage?: string
}

export function respondBooking(bookingId: string, dto: RespondBookingDto, token: string) {
  return api.patch<AdminBooking>(`/bookings/${bookingId}/respond`, dto, authOpts(token))
}
