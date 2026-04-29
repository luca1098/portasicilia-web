import type { CartItem } from '@/core/store/cart.store'

const DEFAULT_COMMISSION_RATE = 0.15

export function computeUnitCommission(item: {
  price: number
  commissionType: 'PERCENTAGE' | 'FLAT' | null
  commissionValue: number | null
}): number {
  const { price, commissionType, commissionValue } = item
  if (commissionType == null || commissionValue == null) {
    return round2(price * DEFAULT_COMMISSION_RATE)
  }
  if (commissionType === 'PERCENTAGE') return round2(price * commissionValue)
  return round2(commissionValue)
}

export function computeLineCommission(item: CartItem): number {
  return round2(computeUnitCommission(item) * item.quantity)
}

export type CartTotals = {
  subtotal: number
  shipping: number
  commissionAmount: number
  depositAmount: number
  balanceDue: number
  total: number
}

export function computeCartTotals(items: CartItem[], shipping = 0): CartTotals {
  const subtotal = round2(items.reduce((sum, i) => sum + i.price * i.quantity, 0))
  const commissionAmount = round2(items.reduce((sum, i) => sum + computeLineCommission(i), 0))
  const total = round2(subtotal + shipping)
  // Customer pays the full total. Commission is internal accounting only.
  const depositAmount = total
  const balanceDue = 0
  return { subtotal, shipping, commissionAmount, depositAmount, balanceDue, total }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
