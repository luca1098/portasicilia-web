import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { favoriteApi, type FavoriteItem } from '@/lib/api/favorite.api'

type FavoriteStore = {
  ids: string[]
  items: FavoriteItem[]
  loaded: boolean
  actions: {
    toggle(listingId: string, token: string): Promise<void>
    fetchIds(token: string): Promise<void>
    fetchAll(token: string): Promise<void>
    clear(): void
  }
}

const useFavoriteStore = create<FavoriteStore>()(
  persist(
    set => ({
      ids: [],
      items: [],
      loaded: false,
      actions: {
        toggle: async (listingId: string, token: string) => {
          const result = await favoriteApi.toggle(listingId, token)
          if (result.favorited) {
            set(state => ({ ids: [...state.ids, listingId] }))
          } else {
            set(state => ({
              ids: state.ids.filter(id => id !== listingId),
              items: state.items.filter(item => item.listing.id !== listingId),
            }))
          }
        },
        fetchIds: async (token: string) => {
          const ids = await favoriteApi.getIds(token)
          set({ ids })
        },
        fetchAll: async (token: string) => {
          const items = await favoriteApi.getAll(token)
          set({ items, ids: items.map(item => item.listing.id), loaded: true })
        },
        clear: () => set({ ids: [], items: [], loaded: false }),
      },
    }),
    {
      name: 'ps-favorites',
      partialize: state => ({ ids: state.ids }),
    }
  )
)

export const useFavoriteActions = () => useFavoriteStore(state => state.actions)
export default useFavoriteStore
