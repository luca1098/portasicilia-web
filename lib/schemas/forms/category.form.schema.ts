import { z } from 'zod'

export const CategoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().max(500).optional().or(z.literal('')),
  icon: z.string().optional().or(z.literal('')),
  cover: z.union([z.instanceof(File), z.string().url(), z.null()]),
  highlighted: z.boolean(),
})

export type CategoryFormValues = z.infer<typeof CategoryFormSchema>
