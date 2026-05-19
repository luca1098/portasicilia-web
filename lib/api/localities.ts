import type { Locality } from '@/lib/schemas/entities/locality.entity.schema'
import type { SupportedLocale } from '@/lib/configs/locales'
import { api, apiServer } from './fetch-client'

export type LocalityCard = {
  id: string
  name: string
  slug: string
  cover: string | null
  state: string | null
  totalActivities: number
  totalStays: number
}

type PaginatedLocalityCards = {
  data: LocalityCard[]
  nextCursor: string | null
}

type GetLocalitiesParams = {
  limit?: number
  lang?: string
}
export async function getLocalities(params?: GetLocalitiesParams) {
  const { limit, lang } = params || {}
  const queryParams: Record<string, string> = {}
  if (limit) {
    queryParams.limit = limit.toString()
  }
  return apiServer.get<Locality[]>('/localities', {
    params: queryParams,
    ...(lang && lang !== 'it' && { lang: lang as SupportedLocale }),
  })
}

export async function getLocalitiesAdmin(headers: HeadersInit) {
  return apiServer.get<Locality[]>('/localities/admin', { headers })
}

type GetLocalityCardsParams = {
  highlighted?: boolean
  limit?: number
  cursor?: string
  exclude?: string
  lang?: string
}

export async function getLocalityCards(params?: GetLocalityCardsParams) {
  const { highlighted, limit, cursor, exclude, lang } = params || {}
  const queryParams: Record<string, string> = {}
  if (highlighted !== undefined) queryParams.highlighted = highlighted.toString()
  if (limit) queryParams.limit = limit.toString()
  if (cursor) queryParams.cursor = cursor
  if (exclude) queryParams.exclude = exclude
  return apiServer.get<PaginatedLocalityCards>('/localities/cards', {
    params: queryParams,
    ...(lang && lang !== 'it' && { lang: lang as SupportedLocale }),
  })
}

type GetSuggestedLocalitiesParams = {
  exclude?: string
  limit?: number
  lang?: string
}

export async function getSuggestedLocalities(params?: GetSuggestedLocalitiesParams) {
  const { exclude, limit, lang } = params || {}
  const queryParams: Record<string, string> = {}
  if (exclude) queryParams.exclude = exclude
  if (limit) queryParams.limit = limit.toString()
  return apiServer.get<LocalityCard[]>('/localities/suggested', {
    params: queryParams,
    ...(lang && lang !== 'it' && { lang: lang as SupportedLocale }),
  })
}

export function getLocalitiesClient(params?: GetLocalitiesParams) {
  const { limit, lang } = params || {}
  const queryParams: Record<string, string> = {}
  if (limit) {
    queryParams.limit = limit.toString()
  }
  return api.get<Locality[]>('/localities', {
    params: queryParams,
    ...(lang && lang !== 'it' && { lang: lang as SupportedLocale }),
  })
}

export function getLocalityById(id: string, lang?: string) {
  return apiServer.get<Locality>(`/localities/${id}`, {
    ...(lang && lang !== 'it' && { lang: lang as SupportedLocale }),
  })
}

export function getLocalityBySlug(slug: string, lang?: string) {
  return apiServer.get<Locality>(`/localities/slug/${slug}`, {
    ...(lang && lang !== 'it' && { lang: lang as SupportedLocale }),
  })
}

export function createLocality(data: FormData, headers: HeadersInit) {
  return apiServer.post<Locality>('/localities', data, { headers })
}

export function updateLocality(id: string, data: FormData, headers: HeadersInit) {
  return apiServer.patch<Locality>(`/localities/${id}`, data, { headers })
}

export function deleteLocality(id: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/localities/${id}`, { headers })
}
