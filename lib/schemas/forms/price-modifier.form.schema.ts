import { z } from 'zod'

export const PriceModifierFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['SEASONAL', 'DAY_OF_WEEK', 'EARLY_BIRD', 'LAST_MINUTE', 'TIME_SLOT', 'CUSTOM']),
  adjustmentType: z.enum(['PERCENTAGE', 'ABSOLUTE']),
  value: z.number(),
  priority: z.number().int().optional(),
  conditions: z.string().optional(),
  stackable: z.boolean(),
  active: z.boolean(),
})

export type PriceModifierFormValues = z.infer<typeof PriceModifierFormSchema>
