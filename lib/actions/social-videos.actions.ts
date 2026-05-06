'use server'

import {
  createSocialVideo,
  updateSocialVideo,
  deleteSocialVideo,
  reorderSocialVideos,
  searchListingsForVideo,
} from '@/lib/api/social-videos'
import type { SocialVideo } from '@/lib/schemas/entities/social-video.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

const REVALIDATE_PATH = '/[lang]/(dashboard)/dashboard/admin/social-videos'

export async function createSocialVideoAction(
  data: Record<string, unknown>
): Promise<ActionResult<SocialVideo>> {
  try {
    const headers = await getAuthHeaders()
    const video = await createSocialVideo(data, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true, data: video }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateSocialVideoAction(
  id: string,
  data: Record<string, unknown>
): Promise<ActionResult<SocialVideo>> {
  try {
    const headers = await getAuthHeaders()
    const video = await updateSocialVideo(id, data, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true, data: video }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteSocialVideoAction(id: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteSocialVideo(id, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function reorderSocialVideosAction(
  items: { id: string; order: number }[]
): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await reorderSocialVideos(items, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function searchListingsForVideoAction(
  query: string
): Promise<ActionResult<{ id: string; name: string; type: 'EXPERIENCE' | 'STAY'; slug: string }[]>> {
  try {
    const headers = await getAuthHeaders()
    const data = await searchListingsForVideo(query, headers)
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
