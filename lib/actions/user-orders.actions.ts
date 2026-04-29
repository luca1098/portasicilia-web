'use server'

import { cancelUserOrder, getUserOrders, type UserOrder } from '@/lib/api/user-orders'
import { type ActionResult, getAuthHeaders } from './action.types'

export async function getUserOrdersAction(): Promise<ActionResult<UserOrder[]>> {
  try {
    const headers = await getAuthHeaders()
    const result = await getUserOrders(headers)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function cancelUserOrderAction(orderId: string): Promise<ActionResult<UserOrder>> {
  try {
    const headers = await getAuthHeaders()
    const result = await cancelUserOrder(orderId, headers)
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
