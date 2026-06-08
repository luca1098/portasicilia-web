import { z } from 'zod'

export const RecurringStayPriceFormSchema = z.object({
  name: z.string().min(1),
  // JS getDay() numbering: 0=Sunday … 6=Saturday. At least one day required.
  dayOfWeek: z.array(z.number().int().min(0).max(6)).min(1),
  overrideAmount: z.number().min(0),
  // Optional bounds — blank means the recurring price applies indefinitely.
  dateFrom: z.string(),
  dateTo: z.string(),
})

export type RecurringStayPriceFormValues = z.infer<typeof RecurringStayPriceFormSchema>
