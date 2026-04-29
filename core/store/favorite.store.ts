import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { favoriteApi, type FavoriteListingItem, type FavoriteProductItem } from '@/lib/api/favorite.api'

type FavoriteStore = {
  listingIds: string[]
  productIds: string[]
  listingItems: FavoriteListingItem[]
  productItems: FavoriteProductItem[]
  loaded: boolean
  actions: {
    toggleListing(listingId: string, token: string): Promise<void>
    toggleProduct(productId: string, token: string): Promise<void>
    fetchIds(token: string): Promise<void>
    fetchAll(token: string): Promise<void>
    clear(): void
  }
}

const useFavoriteStore = create<FavoriteStore>()(
  persist(
    set => ({
      listingIds: [],
      productIds: [],
      listingItems: [],
      productItems: [],
      loaded: false,
      actions: {
        toggleListing: async (listingId: string, token: string) => {
          const result = await favoriteApi.toggleListing(listingId, token)
          if (result.favorited) {
            set(state => ({ listingIds: [...state.listingIds, listingId] }))
          } else {
            set(state => ({
              listingIds: state.listingIds.filter(id => id !== listingId),
              listingItems: state.listingItems.filter(item => item.listing.id !== listingId),
            }))
          }
        },
        toggleProduct: async (productId: string, token: string) => {
          const result = await favoriteApi.toggleProduct(productId, token)
          if (result.favorited) {
            set(state => ({ productIds: [...state.productIds, productId] }))
          } else {
            set(state => ({
              productIds: state.productIds.filter(id => id !== productId),
              productItems: state.productItems.filter(item => item.product.id !== productId),
            }))
          }
        },
        fetchIds: async (token: string) => {
          const [listingIds, productIds] = await Promise.all([
            favoriteApi.getListingIds(token),
            favoriteApi.getProductIds(token),
          ])
          set({ listingIds, productIds })
        },
        fetchAll: async (token: string) => {
          const [listingItems, productItems] = await Promise.all([
            favoriteApi.getAllListings(token),
            favoriteApi.getAllProducts(token),
          ])
          set({
            listingItems,
            productItems,
            listingIds: listingItems.map(item => item.listing.id),
            productIds: productItems.map(item => item.product.id),
            loaded: true,
          })
        },
        clear: () =>
          set({
            listingIds: [],
            productIds: [],
            listingItems: [],
            productItems: [],
            loaded: false,
          }),
      },
    }),
    {
      name: 'ps-favorites',
      partialize: state => ({ listingIds: state.listingIds, productIds: state.productIds }),
    }
  )
)

export const useFavoriteActions = () => useFavoriteStore(state => state.actions)
export default useFavoriteStore
