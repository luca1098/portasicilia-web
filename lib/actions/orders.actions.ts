'use server'

import {
  checkoutOrder,
  confirmOrder,
  getAdminOrders,
  updateOrderStatus,
  type AdminOrder,
  type CreateOrderDto,
  type OrderCheckoutResponse,
  type OrderResponse,
  type OrderStatus,
  type PaginatedAdminOrders,
  type GetAdminOrdersParams,
} from '@/lib/api/orders'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function checkoutOrderAction(
  data: CreateOrderDto
): Promise<ActionResult<OrderCheckoutResponse>> {
  try {
    const headers = await getAuthHeaders()
    const result = await checkoutOrder(data, headers)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function confirmOrderAction(paymentIntentId: string): Promise<ActionResult<OrderResponse>> {
  try {
    const headers = await getAuthHeaders()
    const order = await confirmOrder(paymentIntentId, headers)
    return { success: true, data: order }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function getAdminOrdersAction(
  params: GetAdminOrdersParams
): Promise<ActionResult<PaginatedAdminOrders>> {
  try {
    const headers = await getAuthHeaders()
    const result = await getAdminOrders(headers, params)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<ActionResult<AdminOrder>> {
  try {
    const headers = await getAuthHeaders()
    const order = await updateOrderStatus(orderId, status, headers)
    return { success: true, data: order }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
