import type { Product, ShopCategory } from '@/lib/schemas/entities/product.entity.schema'
import type { SupportedLocale } from '@/lib/configs/locales'
import { apiServer } from './fetch-client'

export function getProducts(categoryId?: string, lang?: string) {
  return apiServer.get<Product[]>('/products', {
    ...(categoryId && { params: { categoryId } }),
    ...(lang && lang !== 'it' && { lang: lang as SupportedLocale }),
  })
}

export function getHighlightedProducts(lang?: string) {
  return apiServer.get<Product[]>('/products/highlighted', {
    ...(lang && lang !== 'it' && { lang: lang as SupportedLocale }),
  })
}

export function getProductsAdmin(headers: HeadersInit) {
  return apiServer.get<Product[]>('/products/admin', { headers })
}

export function getProductById(id: string) {
  return apiServer.get<Product>(`/products/${id}`)
}

export function getProductBySlug(slug: string, lang?: string) {
  return apiServer.get<Product>(`/products/slug/${slug}`, {
    ...(lang && lang !== 'it' && { lang: lang as SupportedLocale }),
  })
}

export function createProduct(data: FormData, headers: HeadersInit) {
  return apiServer.post<Product>('/products', data, { headers })
}

export function updateProduct(id: string, data: FormData, headers: HeadersInit) {
  return apiServer.patch<Product>(`/products/${id}`, data, { headers })
}

export function deleteProduct(id: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/products/${id}`, { headers })
}

// Shop Categories
export function getShopCategories() {
  return apiServer.get<ShopCategory[]>('/shop-categories')
}

export function getShopCategoriesAdmin(headers: HeadersInit) {
  return apiServer.get<ShopCategory[]>('/shop-categories/admin', { headers })
}

export function getShopCategoryById(id: string) {
  return apiServer.get<ShopCategory>(`/shop-categories/${id}`)
}

export function createShopCategory(data: FormData, headers: HeadersInit) {
  return apiServer.post<ShopCategory>('/shop-categories', data, { headers })
}

export function updateShopCategory(id: string, data: FormData, headers: HeadersInit) {
  return apiServer.patch<ShopCategory>(`/shop-categories/${id}`, data, { headers })
}

export function deleteShopCategory(id: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/shop-categories/${id}`, { headers })
}
