import type { Article } from '@/lib/schemas/entities/article.entity.schema'
import type { Author } from '@/lib/schemas/entities/author.entity.schema'
import { apiServer } from './fetch-client'

// ==================== PUBLIC: ARTICLES ====================

export function getArticles(params?: {
  categoryId?: string
  localityId?: string
  limit?: number
  cursor?: string
}) {
  const searchParams = new URLSearchParams()
  if (params?.categoryId) searchParams.set('categoryId', params.categoryId)
  if (params?.localityId) searchParams.set('localityId', params.localityId)
  if (params?.limit) searchParams.set('limit', String(params.limit))
  if (params?.cursor) searchParams.set('cursor', params.cursor)
  const qs = searchParams.toString()
  return apiServer.get<{ data: Article[]; nextCursor: string | null }>(`/blog/articles${qs ? `?${qs}` : ''}`)
}

export function getRecentArticles(limit?: number) {
  return apiServer.get<Article[]>(`/blog/articles/recent${limit ? `?limit=${limit}` : ''}`)
}

export function getArticleBySlug(slug: string) {
  return apiServer.get<Article>(`/blog/articles/slug/${slug}`)
}

// ==================== PUBLIC: AUTHORS ====================

export function getAuthors() {
  return apiServer.get<Author[]>('/blog/authors')
}

export function getAuthorBySlug(slug: string) {
  return apiServer.get<Author & { articles: Article[] }>(`/blog/authors/slug/${slug}`)
}

// ==================== ADMIN: ARTICLES ====================

export function getArticlesAdmin(headers: HeadersInit) {
  return apiServer.get<Article[]>('/blog/admin/articles', { headers })
}

export function getArticleById(id: string, headers: HeadersInit) {
  return apiServer.get<Article>(`/blog/admin/articles/${id}`, { headers })
}

export function createArticle(data: FormData, headers: HeadersInit) {
  return apiServer.post<Article>('/blog/admin/articles', data, { headers })
}

export function updateArticle(id: string, data: FormData, headers: HeadersInit) {
  return apiServer.patch<Article>(`/blog/admin/articles/${id}`, data, { headers })
}

export function deleteArticle(id: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/blog/admin/articles/${id}`, { headers })
}

// ==================== ADMIN: AUTHORS ====================

export function getAuthorsAdmin(headers: HeadersInit) {
  return apiServer.get<Author[]>('/blog/admin/authors', { headers })
}

export function createAuthor(data: FormData, headers: HeadersInit) {
  return apiServer.post<Author>('/blog/admin/authors', data, { headers })
}

export function updateAuthor(id: string, data: FormData, headers: HeadersInit) {
  return apiServer.patch<Author>(`/blog/admin/authors/${id}`, data, { headers })
}

export function deleteAuthor(id: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/blog/admin/authors/${id}`, { headers })
}
