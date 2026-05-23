import { z } from 'zod'

export const ExperienceSeasonTierPriceFormSchema = z.object({
  priceTierId: z.string().min(1),
  overrideAmount: z.number().min(0),
})

export const ExperienceSeasonFormSchema = z
  .object({
    name: z.string().min(1),
    dateFrom: z.string().min(1),
    dateTo: z.string().min(1),
    priority: z.number().int().min(0),
    tierPrices: z.array(ExperienceSeasonTierPriceFormSchema).min(1),
  })
  .refine(d => new Date(d.dateFrom) <= new Date(d.dateTo), {
    message: 'dateTo must be greater than or equal to dateFrom',
    path: ['dateTo'],
  })

export type ExperienceSeasonFormValues = z.infer<typeof ExperienceSeasonFormSchema>
