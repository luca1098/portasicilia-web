'use server'

import {
  createPriceList,
  updatePriceList,
  deletePriceList as deletePriceListApi,
  createPriceTier,
  updatePriceTier,
  deletePriceTier as deletePriceTierApi,
  createPriceModifier,
  updatePriceModifier,
  deletePriceModifier as deletePriceModifierApi,
  createPriceOverride,
  updatePriceOverride,
  deletePriceOverride as deletePriceOverrideApi,
} from '@/lib/api/pricing'
import type {
  PriceList,
  PriceTier,
  PriceModifier,
  PriceOverride,
} from '@/lib/schemas/entities/pricing.entity.schema'
import { revalidatePath } from 'next/cache'
import { type ActionResult, getAuthHeaders } from './action.types'

const REVALIDATE_PATH = '/[lang]/(dashboard)/dashboard/admin/experiences/[id]'

// ==================== PRICE LIST ====================

export async function createPriceListAction(data: Record<string, unknown>): Promise<ActionResult<PriceList>> {
  try {
    const headers = await getAuthHeaders()
    const result = await createPriceList(data, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updatePriceListAction(
  id: string,
  data: Record<string, unknown>
): Promise<ActionResult<PriceList>> {
  try {
    const headers = await getAuthHeaders()
    const result = await updatePriceList(id, data, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deletePriceListAction(id: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deletePriceListApi(id, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// ==================== PRICE TIER ====================

export async function createPriceTierAction(
  priceListId: string,
  data: Record<string, unknown>
): Promise<ActionResult<PriceTier>> {
  try {
    const headers = await getAuthHeaders()
    const result = await createPriceTier(priceListId, data, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updatePriceTierAction(
  priceListId: string,
  tierId: string,
  data: Record<string, unknown>
): Promise<ActionResult<PriceTier>> {
  try {
    const headers = await getAuthHeaders()
    const result = await updatePriceTier(priceListId, tierId, data, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deletePriceTierAction(priceListId: string, tierId: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deletePriceTierApi(priceListId, tierId, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// ==================== PRICE MODIFIER ====================

export async function createPriceModifierAction(
  priceListId: string,
  data: Record<string, unknown>
): Promise<ActionResult<PriceModifier>> {
  try {
    const headers = await getAuthHeaders()
    const result = await createPriceModifier(priceListId, data, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updatePriceModifierAction(
  priceListId: string,
  modifierId: string,
  data: Record<string, unknown>
): Promise<ActionResult<PriceModifier>> {
  try {
    const headers = await getAuthHeaders()
    const result = await updatePriceModifier(priceListId, modifierId, data, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deletePriceModifierAction(
  priceListId: string,
  modifierId: string
): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deletePriceModifierApi(priceListId, modifierId, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// ==================== PRICE OVERRIDE ====================

export async function createPriceOverrideAction(
  tierId: string,
  data: Record<string, unknown>
): Promise<ActionResult<PriceOverride>> {
  try {
    const headers = await getAuthHeaders()
    const result = await createPriceOverride(tierId, data, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updatePriceOverrideAction(
  tierId: string,
  overrideId: string,
  data: Record<string, unknown>
): Promise<ActionResult<PriceOverride>> {
  try {
    const headers = await getAuthHeaders()
    const result = await updatePriceOverride(tierId, overrideId, data, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deletePriceOverrideAction(tierId: string, overrideId: string): Promise<ActionResult> {
  try {
    const headers = await getAuthHeaders()
    await deletePriceOverrideApi(tierId, overrideId, headers)
    revalidatePath(REVALIDATE_PATH, 'page')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
