import type { SocialVideo } from '@/lib/schemas/entities/social-video.entity.schema'
import { api, apiServer } from './fetch-client'

export function getSocialVideos() {
  return apiServer.get<SocialVideo[]>('/social-videos')
}

export function getFeaturedSocialVideos() {
  return apiServer.get<SocialVideo[]>('/social-videos/featured')
}

export function getSocialVideosAdmin(headers: HeadersInit) {
  return apiServer.get<SocialVideo[]>('/social-videos/admin', { headers, cache: 'no-store' })
}

export function createSocialVideo(data: Record<string, unknown>, headers: HeadersInit) {
  return apiServer.post<SocialVideo>('/social-videos', data, { headers })
}

export function updateSocialVideo(id: string, data: Record<string, unknown>, headers: HeadersInit) {
  return apiServer.patch<SocialVideo>(`/social-videos/${id}`, data, { headers })
}

export function deleteSocialVideo(id: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/social-videos/${id}`, { headers })
}

export function createSocialVideoClient(data: Record<string, unknown>) {
  return api.post<SocialVideo>('/social-videos', data)
}

export function updateSocialVideoClient(id: string, data: Record<string, unknown>) {
  return api.patch<SocialVideo>(`/social-videos/${id}`, data)
}

export function deleteSocialVideoClient(id: string) {
  return api.delete<void>(`/social-videos/${id}`)
}

export function reorderSocialVideos(items: { id: string; order: number }[], headers: HeadersInit) {
  return apiServer.put<void>('/social-videos/reorder', { items }, { headers })
}

export function searchListingsForVideo(query: string, headers: HeadersInit) {
  return apiServer.get<{ id: string; name: string; type: 'EXPERIENCE' | 'STAY'; slug: string }[]>(
    `/social-videos/listings/search?q=${encodeURIComponent(query)}`,
    { headers }
  )
}
