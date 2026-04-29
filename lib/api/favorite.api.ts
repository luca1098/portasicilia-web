import { api, apiServer } from './fetch-client'

export interface FavoriteListingItem {
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

export interface FavoriteProductItem {
  id: string
  createdAt: string
  product: {
    id: string
    name: string
    slug: string
    cover: string | null
    shortDescription: string | null
    category: { id: string; name: string; slug: string } | null
    reviews: Array<{ rating: number }>
    variants: Array<{
      id: string
      price: string
      compareAtPrice: string | null
      volume: string
      unitOfMeasurement: string
    }>
  }
}

/** @deprecated use FavoriteListingItem */
export type FavoriteItem = FavoriteListingItem

function authOpts(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export const favoriteApi = {
  // Listings
  toggleListing: (listingId: string, token: string) =>
    api.post<{ favorited: boolean }>(`/favorites/listings/${listingId}/toggle`, undefined, authOpts(token)),
  getAllListings: (token: string) => api.get<FavoriteListingItem[]>('/favorites/listings', authOpts(token)),
  getAllListingsServer: (token: string) =>
    apiServer.get<FavoriteListingItem[]>('/favorites/listings', authOpts(token)),
  getListingIds: (token: string) => api.get<string[]>('/favorites/listings/ids', authOpts(token)),

  // Products
  toggleProduct: (productId: string, token: string) =>
    api.post<{ favorited: boolean }>(`/favorites/products/${productId}/toggle`, undefined, authOpts(token)),
  getAllProducts: (token: string) => api.get<FavoriteProductItem[]>('/favorites/products', authOpts(token)),
  getProductIds: (token: string) => api.get<string[]>('/favorites/products/ids', authOpts(token)),
}
