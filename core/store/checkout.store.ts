import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BillingFormValues } from '@/lib/schemas/forms/billing.form.schema'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'

export type PriceTier = {
  tierType: string
  baseAmount: number
  quantity: number
  subtotal: number
}

type BookingContext = {
  experience: Experience
  date: string
  startTime: string
  endTime: string
  adults: number
  children: number
  infants: number
  totalPrice: number
  depositAmount: number | null
  priceTiers: PriceTier[]
  experienceId: string
  slotId: string
  assetCount: number
  pricingMode: string
  assetTierType: string
  paymentError: boolean
}

type CheckoutRestore = {
  depositAmount: number
  billingData: BillingFormValues | null
  checkoutUrl: string
}

type CheckoutStore = {
  billingData: BillingFormValues | null
  checkoutRestore: CheckoutRestore | null
  bookingContext: BookingContext | null
  actions: {
    setBillingData(data: BillingFormValues): void
    setCheckoutRestore(data: CheckoutRestore): void
    setBookingContext(data: BookingContext): void
    clearAll(): void
  }
}

const useCheckoutStore = create<CheckoutStore>()(
  persist(
    set => ({
      billingData: null,
      checkoutRestore: null,
      bookingContext: null,
      actions: {
        setBillingData: (data: BillingFormValues) => set({ billingData: data }),
        setCheckoutRestore: (data: CheckoutRestore) => set({ checkoutRestore: data }),
        setBookingContext: (data: BookingContext) => set({ bookingContext: data }),
        clearAll: () => set({ billingData: null, checkoutRestore: null, bookingContext: null }),
      },
    }),
    {
      name: 'ps-checkout',
      partialize: state => ({
        billingData: state.billingData,
        checkoutRestore: state.checkoutRestore,
        bookingContext: state.bookingContext,
      }),
    }
  )
)

export const useCheckoutActions = () => useCheckoutStore(state => state.actions)
export default useCheckoutStore
