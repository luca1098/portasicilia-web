import type { Category } from '@/lib/schemas/entities/category.entity.schema'
import type { SupportedLocale } from '@/lib/configs/locales'
import { apiServer } from './fetch-client'

export function getCategories(lang?: string) {
  return apiServer.get<Category[]>('/categories', {
    ...(lang && lang !== 'it' && { lang: lang as SupportedLocale }),
  })
}

export function getHighlightedCategories(lang?: string) {
  return apiServer.get<Category[]>('/categories/highlighted', {
    ...(lang && lang !== 'it' && { lang: lang as SupportedLocale }),
  })
}

export function getCategoriesAdmin(headers: HeadersInit) {
  return apiServer.get<Category[]>('/categories/admin', { headers })
}

export function getCategoryById(id: string) {
  return apiServer.get<Category>(`/categories/${id}`)
}

export function getCategoryBySlug(slug: string, lang?: string) {
  return apiServer.get<Category>(`/categories/slug/${slug}`, {
    ...(lang && lang !== 'it' && { lang: lang as SupportedLocale }),
  })
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
