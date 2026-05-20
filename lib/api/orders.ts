import { apiServer } from './fetch-client'

export type CreateOrderItem = {
  variantId: string
  quantity: number
}

export type CreateOrderBilling = {
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

export type CreateOrderShipping = {
  firstName: string
  lastName: string
  street: string
  city: string
  zipCode: string
  province: string
  region: string
  country?: string
  notes?: string
}

export type CreateOrderDto = {
  items: CreateOrderItem[]
  contactEmail: string
  contactPhone: string
  billing: CreateOrderBilling
  shipping: CreateOrderShipping
}

export type OrderCheckoutItem = {
  variantId: string
  productName: string
  productSlug: string
  productCover: string | null
  variantVolume: string
  variantUnit: string
  unitPrice: string
  quantity: number
  subtotal: string
  unitCommission: string
  lineCommission: string
  commissionType: 'PERCENTAGE' | 'FLAT' | null
}

export type OrderCheckoutResponse = {
  clientSecret: string
  subtotalAmount: string
  shippingAmount: string
  commissionAmount: string
  depositAmount: string
  balanceDue: string
  totalAmount: string
  currency: string
  items: OrderCheckoutItem[]
}

export type OrderItem = {
  id: string
  variantId: string
  productName: string
  productSlug: string
  productCover: string | null
  variantVolume: string
  variantUnit: string
  unitPrice: string
  quantity: number
  subtotal: string
  unitCommission: string
  lineCommission: string
  commissionType: 'PERCENTAGE' | 'FLAT' | null
}

export type OrderResponse = {
  id: string
  number: string
  status: string
  contactEmail: string
  contactPhone: string
  subtotalAmount: string
  shippingAmount: string
  commissionAmount: string
  depositAmount: string
  balanceDue: string
  totalAmount: string
  currency: string
  paymentStatus: string
  items: OrderItem[]
  createdAt: string
}

export function checkoutOrder(data: CreateOrderDto, headers: HeadersInit) {
  return apiServer.post<OrderCheckoutResponse>('/orders/checkout', data, { headers })
}

export function confirmOrder(paymentIntentId: string, headers: HeadersInit) {
  return apiServer.post<OrderResponse>('/orders/confirm', { paymentIntentId }, { headers })
}

// Admin types and functions

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export type AdminOrderUser = {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  avatar: string | null
}

export type AdminOrder = {
  id: string
  number: string
  status: OrderStatus
  contactEmail: string
  contactPhone: string
  billingFirstName: string
  billingLastName: string
  billingStreet: string
  billingCity: string
  billingZipCode: string
  billingProvince: string
  billingCountry: string
  shippingFirstName: string
  shippingLastName: string
  shippingStreet: string
  shippingCity: string
  shippingZipCode: string
  shippingProvince: string
  shippingRegion: string
  shippingCountry: string
  shippingNotes: string | null
  subtotalAmount: string
  shippingAmount: string
  commissionAmount: string
  depositAmount: string
  balanceDue: string
  totalAmount: string
  currency: string
  paymentStatus: string
  stripePaymentIntentId: string | null
  items: OrderItem[]
  user: AdminOrderUser
  createdAt: string
  updatedAt: string
}

export type PaginatedAdminOrders = {
  data: AdminOrder[]
  nextCursor: string | null
}

export type OrderSort = 'newest' | 'oldest'

export type GetAdminOrdersParams = {
  status?: string
  statusIn?: string
  paymentStatus?: string
  search?: string
  sort?: OrderSort
  limit?: number
  cursor?: string
}

export function getAdminOrders(headers: HeadersInit, params?: GetAdminOrdersParams) {
  const queryParams: Record<string, string> = {}
  if (params?.status) queryParams.status = params.status
  if (params?.statusIn) queryParams.statusIn = params.statusIn
  if (params?.paymentStatus) queryParams.paymentStatus = params.paymentStatus
  if (params?.search) queryParams.search = params.search
  if (params?.sort) queryParams.sort = params.sort
  if (params?.limit) queryParams.limit = params.limit.toString()
  if (params?.cursor) queryParams.cursor = params.cursor
  return apiServer.get<PaginatedAdminOrders>('/orders/admin', { params: queryParams, headers })
}

export function updateOrderStatus(orderId: string, status: OrderStatus, headers: HeadersInit) {
  return apiServer.patch<AdminOrder>(`/orders/${orderId}/status`, { status }, { headers })
}
