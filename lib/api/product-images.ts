import type { ProductImage } from '@/lib/schemas/entities/product.entity.schema'
import { apiServer } from './fetch-client'

export function createProductImage(productId: string, data: FormData, headers: HeadersInit) {
  return apiServer.post<ProductImage>(`/products/${productId}/images`, data, { headers })
}

export function deleteProductImage(productId: string, imageId: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/products/${productId}/images/${imageId}`, { headers })
}

export function reorderProductImages(
  productId: string,
  items: { id: string; order: number }[],
  headers: HeadersInit
) {
  return apiServer.put<ProductImage[]>(`/products/${productId}/images/reorder`, { items }, { headers })
}
