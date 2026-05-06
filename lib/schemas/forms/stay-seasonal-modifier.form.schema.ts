import { z } from 'zod'

export const StaySeasonalModifierFormSchema = z.object({
  name: z.string().min(1),
  dateFrom: z.string().min(1),
  dateTo: z.string().min(1),
  adjustmentType: z.union([z.literal('PERCENTAGE'), z.literal('ABSOLUTE')]),
  value: z.number().min(0.01),
})

export type StaySeasonalModifierFormValues = z.infer<typeof StaySeasonalModifierFormSchema>
