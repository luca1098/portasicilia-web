import type {
  PriceList,
  PriceTier,
  PriceModifier,
  PriceOverride,
} from '@/lib/schemas/entities/pricing.entity.schema'
import { apiServer } from './fetch-client'

// ==================== PRICE LIST ====================

export function createPriceList(data: unknown, headers: HeadersInit) {
  return apiServer.post<PriceList>('/pricing/price-lists', data, { headers })
}

export function getPriceListById(id: string) {
  return apiServer.get<PriceList>(`/pricing/price-lists/${id}`)
}

export function getPriceListsByExperienceId(experienceId: string) {
  return apiServer.get<PriceList[]>(`/pricing/price-lists`, {
    params: { experienceId },
  })
}

export function updatePriceList(id: string, data: unknown, headers: HeadersInit) {
  return apiServer.patch<PriceList>(`/pricing/price-lists/${id}`, data, { headers })
}

export function deletePriceList(id: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/pricing/price-lists/${id}`, { headers })
}

// ==================== PRICE TIER ====================

export function createPriceTier(priceListId: string, data: unknown, headers: HeadersInit) {
  return apiServer.post<PriceTier>(`/pricing/price-lists/${priceListId}/tiers`, data, { headers })
}

export function updatePriceTier(priceListId: string, tierId: string, data: unknown, headers: HeadersInit) {
  return apiServer.patch<PriceTier>(`/pricing/price-lists/${priceListId}/tiers/${tierId}`, data, { headers })
}

export function deletePriceTier(priceListId: string, tierId: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/pricing/price-lists/${priceListId}/tiers/${tierId}`, { headers })
}

// ==================== PRICE MODIFIER ====================

export function createPriceModifier(priceListId: string, data: unknown, headers: HeadersInit) {
  return apiServer.post<PriceModifier>(`/pricing/price-lists/${priceListId}/modifiers`, data, { headers })
}

export function updatePriceModifier(
  priceListId: string,
  modifierId: string,
  data: unknown,
  headers: HeadersInit
) {
  return apiServer.patch<PriceModifier>(`/pricing/price-lists/${priceListId}/modifiers/${modifierId}`, data, {
    headers,
  })
}

export function deletePriceModifier(priceListId: string, modifierId: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/pricing/price-lists/${priceListId}/modifiers/${modifierId}`, { headers })
}

// ==================== PRICE OVERRIDE ====================

export function createPriceOverride(tierId: string, data: unknown, headers: HeadersInit) {
  return apiServer.post<PriceOverride>(`/pricing/tiers/${tierId}/overrides`, data, { headers })
}

export function updatePriceOverride(tierId: string, overrideId: string, data: unknown, headers: HeadersInit) {
  return apiServer.patch<PriceOverride>(`/pricing/tiers/${tierId}/overrides/${overrideId}`, data, {
    headers,
  })
}

export function deletePriceOverride(tierId: string, overrideId: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/pricing/tiers/${tierId}/overrides/${overrideId}`, { headers })
}
