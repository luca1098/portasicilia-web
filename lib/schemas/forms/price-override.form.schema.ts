import { z } from 'zod'

export const PriceOverrideFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  overrideAmount: z.number().min(0),
  dateFrom: z.string().min(1, 'Date from is required'),
  dateTo: z.string().min(1, 'Date to is required'),
  dayOfWeek: z.string().optional(),
  timeSlots: z.string().optional(),
  priority: z.number().int().optional(),
  reason: z.string().optional(),
  active: z.boolean(),
})

export type PriceOverrideFormValues = z.infer<typeof PriceOverrideFormSchema>
