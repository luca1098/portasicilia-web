import type {
  PriceList,
  PriceTier,
  PriceModifier,
  PriceOverride,
  ExperienceSeason,
} from '@/lib/schemas/entities/pricing.entity.schema'
import { apiServer } from './fetch-client'

// ==================== PRICE LIST ====================

export function createPriceList(data: unknown, headers: HeadersInit) {
  return apiServer.post<PriceList>('/pricing/price-lists', data, { headers })
}

export function getPriceListById(id: string) {
  return apiServer.get<PriceList>(`/pricing/price-lists/${id}`)
}

export function getPriceListsByListingId(listingId: string) {
  return apiServer.get<PriceList[]>('/pricing/price-lists', {
    params: { listingId },
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
  return apiServer.post<PriceTier>(
    '/pricing/tiers',
    { ...(data as Record<string, unknown>), priceListId },
    { headers }
  )
}

export function updatePriceTier(_priceListId: string, tierId: string, data: unknown, headers: HeadersInit) {
  return apiServer.patch<PriceTier>(`/pricing/tiers/${tierId}`, data, { headers })
}

export function deletePriceTier(_priceListId: string, tierId: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/pricing/tiers/${tierId}`, { headers })
}

// ==================== PRICE MODIFIER ====================

export function createPriceModifier(priceListId: string, data: unknown, headers: HeadersInit) {
  return apiServer.post<PriceModifier>(
    '/pricing/modifiers',
    { ...(data as Record<string, unknown>), priceListId },
    { headers }
  )
}

export function updatePriceModifier(
  _priceListId: string,
  modifierId: string,
  data: unknown,
  headers: HeadersInit
) {
  return apiServer.patch<PriceModifier>(`/pricing/modifiers/${modifierId}`, data, { headers })
}

export function deletePriceModifier(_priceListId: string, modifierId: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/pricing/modifiers/${modifierId}`, { headers })
}

// ==================== PRICE OVERRIDE ====================

export function createPriceOverride(priceTierId: string, data: unknown, headers: HeadersInit) {
  return apiServer.post<PriceOverride>(
    '/pricing/overrides',
    { ...(data as Record<string, unknown>), priceTierId },
    { headers }
  )
}

export function updatePriceOverride(
  _tierId: string,
  overrideId: string,
  data: unknown,
  headers: HeadersInit
) {
  return apiServer.patch<PriceOverride>(`/pricing/overrides/${overrideId}`, data, { headers })
}

export function deletePriceOverride(_tierId: string, overrideId: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/pricing/overrides/${overrideId}`, { headers })
}

// ==================== PRICE CALCULATION ====================

export type PriceLineItem = {
  tierType: string
  label: string | null
  quantity: number
  quantityType: 'person' | 'experience' | 'asset' | 'night' | 'fee'
  basePrice: string
  overrideApplied: {
    name: string
    overrideAmount: string
    reason: string | null
  } | null
  effectiveUnitPrice: string
  modifiersApplied: unknown[]
  finalUnitPrice: string
  subtotal: string
}

export type PriceBreakdown = {
  listingId: string
  pricingMode: string
  date: string
  lineItems: PriceLineItem[]
  modifiersApplied: unknown[]
  subtotalBeforeModifiers: string
  modifiersTotal: string
  subtotalAfterModifiers: string
  promoDiscount: string
  netPrice: string
  total: string
  currency: string
  commissionRate: string
  commissionAmount: string
  supplierPayout: string
  calculatedAt: string
}

export type CalculatePriceInput = {
  listingId: string
  date: string
  timeSlot?: string
  participants?: { type: string; quantity: number }[]
  assets?: { type: string; quantity: number }[]
  totalParticipants?: number
  numberOfNights?: number
  promoCode?: string
}

export function calculatePrice(data: CalculatePriceInput) {
  return apiServer.post<PriceBreakdown>('/pricing/calculate', data)
}

// ==================== EXPERIENCE SEASON ====================

export function createSeason(data: unknown, headers: HeadersInit) {
  return apiServer.post<ExperienceSeason>('/pricing/seasons', data, { headers })
}

export function getSeasonsByListingId(listingId: string) {
  return apiServer.get<ExperienceSeason[]>(`/pricing/seasons/listing/${listingId}`)
}

export function updateSeason(seasonGroupId: string, data: unknown, headers: HeadersInit) {
  return apiServer.patch<ExperienceSeason>(`/pricing/seasons/${seasonGroupId}`, data, { headers })
}

export function deleteSeason(seasonGroupId: string, headers: HeadersInit) {
  return apiServer.delete<void>(`/pricing/seasons/${seasonGroupId}`, { headers })
}
