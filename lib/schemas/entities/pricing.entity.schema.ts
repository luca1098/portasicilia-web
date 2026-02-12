import { z } from 'zod'

// ==================== ENUMS ====================

export const PricingModeSchema = z.union([
  z.literal('PER_PERSON'),
  z.literal('PER_EXPERIENCE'),
  z.literal('PER_ASSET'),
])

export type PricingMode = z.infer<typeof PricingModeSchema>

export const ModifierTypeSchema = z.union([
  z.literal('SEASONAL'),
  z.literal('DAY_OF_WEEK'),
  z.literal('EARLY_BIRD'),
  z.literal('LAST_MINUTE'),
  z.literal('TIME_SLOT'),
  z.literal('CUSTOM'),
])

export type ModifierType = z.infer<typeof ModifierTypeSchema>

export const AdjustmentTypeSchema = z.union([z.literal('PERCENTAGE'), z.literal('ABSOLUTE')])

export type AdjustmentType = z.infer<typeof AdjustmentTypeSchema>

// ==================== SUB-ENTITIES ====================

export const PriceOverrideSchema = z.object({
  id: z.string(),
  name: z.string(),
  overrideAmount: z.number(),
  dateFrom: z.string(),
  dateTo: z.string(),
  dayOfWeek: z.array(z.number()).nullable(),
  timeSlots: z.array(z.string()).nullable(),
  priority: z.number().int().nullable(),
  reason: z.string().nullable(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type PriceOverride = z.infer<typeof PriceOverrideSchema>

export const PriceModifierSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: ModifierTypeSchema,
  adjustmentType: AdjustmentTypeSchema,
  value: z.number(),
  priority: z.number().int().nullable(),
  conditions: z.unknown().nullable(),
  stackable: z.boolean(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type PriceModifier = z.infer<typeof PriceModifierSchema>

export const PriceTierSchema = z.object({
  id: z.string(),
  tierType: z.string(),
  label: z.string().nullable(),
  baseAmount: z.number(),
  minQuantity: z.number().int().nullable(),
  maxQuantity: z.number().int().nullable(),
  description: z.string().nullable(),
  overrides: z.array(PriceOverrideSchema).nullish(),
  modifiers: z.array(PriceModifierSchema).nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type PriceTier = z.infer<typeof PriceTierSchema>

// ==================== PRICE LIST ====================

export const PriceListSchema = z.object({
  id: z.string(),
  currency: z.string(),
  pricingMode: PricingModeSchema,
  experienceId: z.string(),
  tiers: z.array(PriceTierSchema).nullish(),
  modifiers: z.array(PriceModifierSchema).nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type PriceList = z.infer<typeof PriceListSchema>
