import { z } from 'zod'

const PRICING_MODES = ['PER_PERSON', 'PER_EXPERIENCE', 'PER_ASSET'] as const
const PARTICIPANT_TYPES = ['ADULT', 'CHILD', 'INFANT'] as const

const PriceTierSchema = z.object({
  id: z.string().optional(),
  tierType: z.string().min(1, 'Tier type is required'),
  label: z.string().nullish(),
  baseAmount: z.number().min(0, 'Price must be 0 or more').max(99999999.99, 'Price exceeds maximum'),
  minQuantity: z.number().int().min(1).nullish(),
  maxQuantity: z.number().int().min(1).nullish(),
  description: z.string().nullish(),
})

const experienceRangeRefine = (
  data: { pricingMode: string; priceTiers: z.infer<typeof PriceTierSchema>[] },
  ctx: z.RefinementCtx,
  maxCapacity?: number
) => {
  if (data.pricingMode !== 'PER_EXPERIENCE') return

  const sorted = [...data.priceTiers].sort((a, b) => (a.minQuantity ?? 1) - (b.minQuantity ?? 1))

  for (let i = 0; i < sorted.length; i++) {
    const tier = sorted[i]
    const originalIndex = data.priceTiers.indexOf(tier)

    if (data.priceTiers.length > 1 && (tier.minQuantity == null || tier.maxQuantity == null)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Both min and max quantity are required for quantity ranges',
        path: ['priceTiers', originalIndex, 'minQuantity'],
      })
      continue
    }

    if (tier.minQuantity != null && tier.maxQuantity != null && tier.minQuantity > tier.maxQuantity) {
      ctx.addIssue({
        code: 'custom',
        message: 'Min must be less than or equal to max',
        path: ['priceTiers', originalIndex, 'minQuantity'],
      })
    }

    if (maxCapacity != null && tier.maxQuantity != null && tier.maxQuantity > maxCapacity) {
      ctx.addIssue({
        code: 'custom',
        message: `Cannot exceed max capacity (${maxCapacity})`,
        path: ['priceTiers', originalIndex, 'maxQuantity'],
      })
    }

    if (i > 0) {
      const prev = sorted[i - 1]
      if (prev.maxQuantity != null && tier.minQuantity != null && tier.minQuantity !== prev.maxQuantity + 1) {
        ctx.addIssue({
          code: 'custom',
          message: `Range must start at ${prev.maxQuantity + 1} to be contiguous`,
          path: ['priceTiers', originalIndex, 'minQuantity'],
        })
      }
    }
  }
}

export const PricingTabSchema = z
  .object({
    priceListId: z.string().optional(),
    pricingMode: z.enum(PRICING_MODES),
    priceTiers: z.array(PriceTierSchema).min(1, 'At least one price tier is required'),
  })
  .superRefine((data, ctx) => experienceRangeRefine(data, ctx))

export const DefaultPricingSchema = z
  .object({
    pricingMode: z.enum(PRICING_MODES),
    priceTiers: z.array(PriceTierSchema).min(1, 'At least one price tier is required'),
  })
  .superRefine((data, ctx) => experienceRangeRefine(data, ctx))

export const createDefaultPricingSchema = (maxCapacity?: number) =>
  z
    .object({
      pricingMode: z.enum(PRICING_MODES),
      priceTiers: z.array(PriceTierSchema).min(1, 'At least one price tier is required'),
    })
    .superRefine((data, ctx) => experienceRangeRefine(data, ctx, maxCapacity))

export type PricingTabValues = z.infer<typeof PricingTabSchema>
export type DefaultPricingValues = z.infer<typeof DefaultPricingSchema>
export type PriceTierValues = z.infer<typeof PriceTierSchema>

export { PRICING_MODES, PARTICIPANT_TYPES, PriceTierSchema }
