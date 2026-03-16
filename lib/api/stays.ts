import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import { apiServer } from './fetch-client'

type PaginatedStays = {
  data: Stay[]
  nextCursor: string | null
}

export type StayCard = {
  id: string
  name: string
  slug: string
  cover: string | null
  avgRating: number | null
  reviewCount: number
  maxPeople: number | null
  bedNumber: number | null
  nightlyPrice: number | null
  pricingMode: string | null
}

type PaginatedStayCards = {
  data: StayCard[]
  nextCursor: string | null
}

type GetStaysParams = {
  localityId?: string
  limit?: number
  cursor?: string
}

export async function getStays(params?: GetStaysParams) {
  const { localityId, limit, cursor } = params || {}
  const queryParams: Record<string, string> = {}
  if (localityId) queryParams.localityId = localityId
  if (limit) queryParams.limit = limit.toString()
  if (cursor) queryParams.cursor = cursor
  return apiServer.get<PaginatedStays>('/stays', { params: queryParams })
}

type GetStayCardsParams = {
  localityId?: string
  highlighted?: boolean
  limit?: number
  cursor?: string
}

export async function getStayCards(params?: GetStayCardsParams) {
  const { localityId, highlighted, limit, cursor } = params || {}
  const queryParams: Record<string, string> = {}
  if (localityId) queryParams.localityId = localityId
  if (highlighted !== undefined) queryParams.highlighted = highlighted.toString()
  if (limit) queryParams.limit = limit.toString()
  if (cursor) queryParams.cursor = cursor
  return apiServer.get<PaginatedStayCards>('/stays/cards', { params: queryParams })
}

type GetStaysAdminParams = {
  ownerId?: string
  status?: string
  limit?: number
  cursor?: string
}

export async function getStaysAdmin(headers: HeadersInit, params?: GetStaysAdminParams) {
  const { ownerId, status, limit, cursor } = params || {}
  const queryParams: Record<string, string> = {}
  if (ownerId) queryParams.ownerId = ownerId
  if (status) queryParams.status = status
  if (limit) queryParams.limit = limit.toString()
  if (cursor) queryParams.cursor = cursor
  return apiServer.get<PaginatedStays>('/stays/admin', { params: queryParams, headers })
}

export function getStayById(id: string) {
  return apiServer.get<Stay>(`/stays/${id}`)
}

export function getStayBySlug(slug: string) {
  return apiServer.get<Stay>(`/stays/slug/${slug}`)
}

export function createStay(data: FormData, headers: HeadersInit) {
  return apiServer.post<Stay>('/stays', data, { headers })
}

export function updateStay(id: string, data: FormData, headers: HeadersInit) {
  return apiServer.patch<Stay>(`/stays/${id}`, data, { headers })
}

export function deleteStay(id: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/stays/${id}`, { headers })
}

export function setStayAvailability(id: string, data: unknown, headers: HeadersInit) {
  return apiServer.put<Stay>(`/stays/${id}/availability`, data, { headers })
}

export function setStayPricing(id: string, data: unknown, headers: HeadersInit) {
  return apiServer.put<unknown>(`/stays/${id}/pricing`, data, { headers })
}

export type StayAvailabilityResponse = {
  availability: Array<{
    id: string
    dateFrom: string
    dateTo: string
    available: boolean
    source: string
  }>
  hasIcs: boolean
  icsSyncedAt: string | null
  icsSyncError: string | null
}

export function getStayAvailability(id: string) {
  return apiServer.get<StayAvailabilityResponse>(`/stays/${id}/availability`)
}

export function setStayIcsUrl(id: string, data: { icsUrl: string | null }, headers: HeadersInit) {
  return apiServer.put<Stay>(`/stays/${id}/ics`, data, { headers })
}

export function syncStayIcs(id: string, headers: HeadersInit) {
  return apiServer.post<Stay>(`/stays/${id}/ics/sync`, {}, { headers })
}
