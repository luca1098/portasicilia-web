'use server'

import { getOwnerOrders, updateOwnerOrderStatus, type GetOwnerOrdersParams } from '@/lib/api/owner-orders'
import type { AdminOrder, OrderStatus, PaginatedAdminOrders } from '@/lib/api/orders'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function getOwnerOrdersAction(
  params: GetOwnerOrdersParams
): Promise<ActionResult<PaginatedAdminOrders>> {
  try {
    const headers = await getAuthHeaders()
    const result = await getOwnerOrders(headers, params)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateOwnerOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<ActionResult<AdminOrder>> {
  try {
    const headers = await getAuthHeaders()
    const result = await updateOwnerOrderStatus(orderId, status, headers)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
