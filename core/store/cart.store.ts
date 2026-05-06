import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  productId: string
  productSlug: string
  productName: string
  productCover: string | null
  variantId: string
  variantVolume: number
  variantUnit: string
  price: number
  quantity: number
  maxQuantity: number
  commissionType: 'PERCENTAGE' | 'FLAT' | null
  commissionValue: number | null
}

type CartStore = {
  items: CartItem[]
  isOpen: boolean
  actions: {
    addItem(item: Omit<CartItem, 'quantity'>, quantity?: number): void
    removeItem(variantId: string): void
    setQuantity(variantId: string, quantity: number): void
    clear(): void
    open(): void
    close(): void
    setOpen(value: boolean): void
  }
}

const useCartStore = create<CartStore>()(
  persist(
    set => ({
      items: [],
      isOpen: false,
      actions: {
        addItem: (item, quantity = 1) =>
          set(state => {
            const existing = state.items.find(i => i.variantId === item.variantId)
            if (existing) {
              const nextQty = Math.min(existing.maxQuantity, existing.quantity + quantity)
              return {
                items: state.items.map(i =>
                  i.variantId === item.variantId ? { ...i, quantity: nextQty } : i
                ),
              }
            }
            const nextQty = Math.min(item.maxQuantity, Math.max(1, quantity))
            return { items: [...state.items, { ...item, quantity: nextQty }] }
          }),
        removeItem: variantId =>
          set(state => ({ items: state.items.filter(i => i.variantId !== variantId) })),
        setQuantity: (variantId, quantity) =>
          set(state => ({
            items: state.items
              .map(i =>
                i.variantId === variantId
                  ? { ...i, quantity: Math.min(i.maxQuantity, Math.max(1, quantity)) }
                  : i
              )
              .filter(i => i.quantity > 0),
          })),
        clear: () => set({ items: [] }),
        open: () => set({ isOpen: true }),
        close: () => set({ isOpen: false }),
        setOpen: value => set({ isOpen: value }),
      },
    }),
    {
      name: 'ps-cart',
      partialize: state => ({ items: state.items }),
    }
  )
)

export const useCartActions = () => useCartStore(state => state.actions)
export default useCartStore
