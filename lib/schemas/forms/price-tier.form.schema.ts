import { z } from 'zod'

export const PriceTierFormSchema = z.object({
  tierType: z.string().min(1, 'Tier type is required'),
  label: z.string().optional(),
  baseAmount: z.number().min(0),
  minQuantity: z.number().int().optional(),
  maxQuantity: z.number().int().optional(),
  description: z.string().optional(),
})

export type PriceTierFormValues = z.infer<typeof PriceTierFormSchema>
