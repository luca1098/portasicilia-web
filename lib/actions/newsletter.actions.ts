'use server'

import { apiServer } from '@/lib/api/fetch-client'
import type { SupportedLocale } from '@/lib/configs/locales'
import type { ActionResult } from './action.types'

export async function subscribeNewsletterAction(
  email: string,
  lang: SupportedLocale
): Promise<ActionResult<void>> {
  try {
    await apiServer.post('/newsletter/subscribe', { email, lang: lang.toUpperCase() }, { lang })
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
