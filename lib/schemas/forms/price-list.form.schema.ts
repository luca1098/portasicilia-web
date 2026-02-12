import { z } from 'zod'

export const PriceListFormSchema = z.object({
  experienceId: z.string().min(1, 'Experience is required'),
  currency: z.string().max(3),
  pricingMode: z.enum(['PER_PERSON', 'PER_EXPERIENCE', 'PER_ASSET']),
})

export type PriceListFormValues = z.infer<typeof PriceListFormSchema>
