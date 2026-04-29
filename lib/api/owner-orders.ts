import { apiServer } from './fetch-client'
import type { AdminOrder, OrderSort, OrderStatus, PaginatedAdminOrders } from './orders'

export type GetOwnerOrdersParams = {
  status?: string
  statusIn?: string
  search?: string
  sort?: OrderSort
  limit?: number
  cursor?: string
}

export function getOwnerOrders(headers: HeadersInit, params?: GetOwnerOrdersParams) {
  const queryParams: Record<string, string> = {}
  if (params?.status) queryParams.status = params.status
  if (params?.statusIn) queryParams.statusIn = params.statusIn
  if (params?.search) queryParams.search = params.search
  if (params?.sort) queryParams.sort = params.sort
  if (params?.limit) queryParams.limit = params.limit.toString()
  if (params?.cursor) queryParams.cursor = params.cursor
  return apiServer.get<PaginatedAdminOrders>('/orders/owner', { params: queryParams, headers })
}

export function updateOwnerOrderStatus(orderId: string, status: OrderStatus, headers: HeadersInit) {
  return apiServer.patch<AdminOrder>(`/orders/${orderId}/owner-status`, { status }, { headers })
}
