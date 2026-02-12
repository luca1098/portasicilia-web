import type { Category } from '@/lib/schemas/entities/category.entity.schema'
import { apiServer } from './fetch-client'

export function getCategories(type?: string) {
  const params: Record<string, string> = {}
  if (type) params.type = type
  return apiServer.get<Category[]>('/categories', { params })
}
