import { z } from 'zod'

export const PriceListFormSchema = z.object({
  currency: z.string().max(3),
  pricingMode: z.enum(['PER_PERSON', 'PER_EXPERIENCE', 'PER_ASSET']),
  validFrom: z.string().min(1, 'Valid from is required'),
  validTo: z.string().min(1, 'Valid to is required'),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
})

export type PriceListFormValues = z.infer<typeof PriceListFormSchema>
