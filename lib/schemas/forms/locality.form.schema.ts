import { z } from 'zod'

export const LocalityFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  state: z.string().optional(),
  description: z.string().max(2000).optional(),
  cover: z.union([z.instanceof(File), z.string().url(), z.null()]),
  highlighted: z.boolean(),
})

export type LocalityFormValues = z.infer<typeof LocalityFormSchema>
