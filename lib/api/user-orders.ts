import { apiServer } from './fetch-client'
import type { OrderItem } from './orders'

export type UserOrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export type UserOrder = {
  id: string
  number: string
  status: UserOrderStatus
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
  totalAmount: string
  currency: string
  paymentStatus: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export function getUserOrders(headers: HeadersInit) {
  return apiServer.get<UserOrder[]>('/orders/my', { headers })
}

export function cancelUserOrder(orderId: string, headers: HeadersInit) {
  return apiServer.patch<UserOrder>(`/orders/${orderId}/cancel`, undefined, { headers })
}
