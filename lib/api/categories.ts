import type { Category } from '@/lib/schemas/entities/category.entity.schema'
import { apiServer } from './fetch-client'

export function getCategories(type?: string) {
  const params: Record<string, string> = {}
  if (type) params.type = type
  return apiServer.get<Category[]>('/categories', { params })
}

export function getCategoryById(id: string) {
  return apiServer.get<Category>(`/categories/${id}`)
}

export function createCategory(data: FormData, headers: HeadersInit) {
  return apiServer.post<Category>('/categories', data, { headers })
}

export function updateCategory(id: string, data: FormData, headers: HeadersInit) {
  return apiServer.patch<Category>(`/categories/${id}`, data, { headers })
}

export function deleteCategory(id: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/categories/${id}`, { headers })
}
