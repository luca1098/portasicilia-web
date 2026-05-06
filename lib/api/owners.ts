import type {
  Owner,
  AdminOwner,
  AdminOwnerListResponse,
  OwnerDeletionPreview,
} from '@/lib/schemas/entities/owner.entity.schema'
import { api, apiServer } from './fetch-client'

type SearchOwnersParams = {
  name?: string
  limit?: number
}

export async function searchOwners(params?: SearchOwnersParams, headers?: HeadersInit) {
  const { name, limit = 10 } = params || {}
  const queryParams: Record<string, string> = {}
  if (name) {
    queryParams.name = name
  }
  if (limit) {
    queryParams.limit = limit.toString()
  }
  return apiServer.get<Owner[]>('/users/owners', { params: queryParams, headers })
}

export function getOwnerById(id: string, headers?: HeadersInit) {
  return apiServer.get<Owner>(`/users/owners/${id}`, { headers })
}

export type AdminOwnersListParams = {
  page?: number
  limit?: number
  search?: string
}

export function getAdminOwners(params?: AdminOwnersListParams, headers?: HeadersInit) {
  const { page = 1, limit = 20, search } = params || {}
  const queryParams: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  }
  if (search) queryParams.search = search
  return apiServer.get<AdminOwnerListResponse>('/admin/owners', { params: queryParams, headers })
}

export function getAdminOwnerById(id: string, headers?: HeadersInit) {
  return apiServer.get<AdminOwner>(`/admin/owners/${id}`, { headers })
}

export type CreateAdminOwnerBody = {
  email: string
  firstName: string
  lastName: string
  phone?: string
  businessName?: string
  vatNumber?: string
  notes?: string
}

export function createAdminOwner(body: CreateAdminOwnerBody, headers?: HeadersInit) {
  return apiServer.post<AdminOwner>('/admin/owners', body, { headers })
}

export type UpdateAdminOwnerBody = Partial<CreateAdminOwnerBody>

export function updateAdminOwner(id: string, body: UpdateAdminOwnerBody, headers?: HeadersInit) {
  return apiServer.patch<AdminOwner>(`/admin/owners/${id}`, body, { headers })
}

export function createAdminOwnerClient(body: CreateAdminOwnerBody) {
  return api.post<AdminOwner>('/admin/owners', body)
}

export function updateAdminOwnerClient(id: string, body: UpdateAdminOwnerBody) {
  return api.patch<AdminOwner>(`/admin/owners/${id}`, body)
}

export function getOwnerDeletionPreview(id: string, headers?: HeadersInit) {
  return apiServer.get<OwnerDeletionPreview>(`/admin/owners/${id}/deletion-preview`, { headers })
}

export function deleteAdminOwner(id: string, headers?: HeadersInit) {
  return apiServer.delete<void>(`/admin/owners/${id}`, { headers })
}

export function deleteAdminOwnerClient(id: string) {
  return api.delete<void>(`/admin/owners/${id}`)
}
