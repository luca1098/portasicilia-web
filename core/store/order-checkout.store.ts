import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BillingFormValues } from '@/lib/schemas/forms/billing.form.schema'
import type { DeliveryFormValues } from '@/lib/schemas/forms/delivery.form.schema'
import type { CartItem } from '@/core/store/cart.store'

export type OrderContext = {
  items: CartItem[]
  subtotal: number
  shipping: number
  commissionAmount: number
  depositAmount: number
  balanceDue: number
  total: number
  paymentError: boolean
}

type OrderCheckoutRestore = {
  totalAmount: number
  billingData: BillingFormValues | null
  deliveryData: DeliveryFormValues | null
  checkoutUrl: string
}

type OrderCheckoutStore = {
  orderContext: OrderContext | null
  billingData: BillingFormValues | null
  deliveryData: DeliveryFormValues | null
  checkoutRestore: OrderCheckoutRestore | null
  actions: {
    setOrderContext(data: OrderContext): void
    setBillingData(data: BillingFormValues): void
    setDeliveryData(data: DeliveryFormValues): void
    setCheckoutRestore(data: OrderCheckoutRestore): void
    clearAll(): void
  }
}

const useOrderCheckoutStore = create<OrderCheckoutStore>()(
  persist(
    set => ({
      orderContext: null,
      billingData: null,
      deliveryData: null,
      checkoutRestore: null,
      actions: {
        setOrderContext: data => set({ orderContext: data }),
        setBillingData: data => set({ billingData: data }),
        setDeliveryData: data => set({ deliveryData: data }),
        setCheckoutRestore: data => set({ checkoutRestore: data }),
        clearAll: () =>
          set({
            orderContext: null,
            billingData: null,
            deliveryData: null,
            checkoutRestore: null,
          }),
      },
    }),
    {
      name: 'ps-order-checkout',
      partialize: state => ({
        orderContext: state.orderContext,
        billingData: state.billingData,
        deliveryData: state.deliveryData,
        checkoutRestore: state.checkoutRestore,
      }),
    }
  )
)

export const useOrderCheckoutActions = () => useOrderCheckoutStore(state => state.actions)
export default useOrderCheckoutStore
