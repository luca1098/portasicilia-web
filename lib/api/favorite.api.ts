import { api, apiServer } from './fetch-client'

export interface FavoriteItem {
  id: string
  createdAt: string
  listing: {
    id: string
    name: string
    slug: string
    cover: string
    type: 'EXPERIENCE' | 'STAY'
    reviews: Array<{ rating: number }>
    priceLists?: Array<{
      pricingMode: string
      currency: string
      tiers: Array<{ tierType: string; baseAmount: string; minQuantity: number }>
    }>
  }
}

function authOpts(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export const favoriteApi = {
  toggle: (listingId: string, token: string) =>
    api.post<{ favorited: boolean }>(`/favorites/${listingId}/toggle`, undefined, authOpts(token)),
  getAll: (token: string) => api.get<FavoriteItem[]>('/favorites', authOpts(token)),
  getAllServer: (token: string) => apiServer.get<FavoriteItem[]>('/favorites', authOpts(token)),
  getIds: (token: string) => api.get<string[]>('/favorites/ids', authOpts(token)),
}
