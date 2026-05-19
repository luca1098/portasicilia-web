import { api, apiServer } from './fetch-client'
import type {
  PartnerApplicationDetail,
  PartnerApplicationInput,
  PartnerApplicationListResponse,
  PartnerApplicationStatus,
  SubmitPartnerApplicationResponse,
} from '@/lib/types/partner-application.type'

export const submitPartnerApplication = async (
  input: PartnerApplicationInput
): Promise<SubmitPartnerApplicationResponse> => {
  return api.post<SubmitPartnerApplicationResponse>('/partner-applications', input)
}

export type ListPartnerApplicationsParams = {
  status?: PartnerApplicationStatus
  q?: string
  page?: number
  pageSize?: number
}

const buildListQuery = (params: ListPartnerApplicationsParams): string => {
  const search = new URLSearchParams()
  if (params.status) search.set('status', params.status)
  if (params.q) search.set('q', params.q)
  if (params.page) search.set('page', String(params.page))
  if (params.pageSize) search.set('pageSize', String(params.pageSize))
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const listPartnerApplications = async (
  params: ListPartnerApplicationsParams,
  headers?: HeadersInit
): Promise<PartnerApplicationListResponse> => {
  return api.get<PartnerApplicationListResponse>(`/admin/partner-applications${buildListQuery(params)}`, {
    headers,
  })
}

export const getAdminPartnerApplications = async (
  params: ListPartnerApplicationsParams,
  headers?: HeadersInit
): Promise<PartnerApplicationListResponse> => {
  return apiServer.get<PartnerApplicationListResponse>(
    `/admin/partner-applications${buildListQuery(params)}`,
    { headers }
  )
}

export const getPartnerApplication = async (id: string): Promise<PartnerApplicationDetail> => {
  return api.get<PartnerApplicationDetail>(`/admin/partner-applications/${id}`)
}

export type UpdatePartnerApplicationPatch = {
  status?: PartnerApplicationStatus
  adminNotes?: string
  rejectionReason?: string
}

export const updatePartnerApplication = async (
  id: string,
  patch: UpdatePartnerApplicationPatch,
  headers?: HeadersInit
): Promise<PartnerApplicationDetail> => {
  return api.patch<PartnerApplicationDetail>(`/admin/partner-applications/${id}`, patch, { headers })
}
