'use server'

import {
  createArticle,
  updateArticle,
  deleteArticle,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from '@/lib/api/blog'
import type { Article } from '@/lib/schemas/entities/article.entity.schema'
import type { Author } from '@/lib/schemas/entities/author.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

// ==================== ARTICLES ====================

export async function createArticleAction(formData: FormData): Promise<ActionResult<Article>> {
  try {
    const headers = await getAuthHeaders()
    const data = await createArticle(formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/blog', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateArticleAction(id: string, formData: FormData): Promise<ActionResult<Article>> {
  try {
    const headers = await getAuthHeaders()
    const data = await updateArticle(id, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/blog', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteArticleAction(id: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteArticle(id, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/blog', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// ==================== AUTHORS ====================

export async function createAuthorAction(formData: FormData): Promise<ActionResult<Author>> {
  try {
    const headers = await getAuthHeaders()
    const data = await createAuthor(formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/blog/authors', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateAuthorAction(id: string, formData: FormData): Promise<ActionResult<Author>> {
  try {
    const headers = await getAuthHeaders()
    const data = await updateAuthor(id, formData, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/blog/authors', 'page')
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteAuthorAction(id: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deleteAuthor(id, headers)
    revalidatePath('/[lang]/(dashboard)/dashboard/admin/blog/authors', 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
