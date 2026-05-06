import { z } from 'zod'

export const TipFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required').max(500),
  cover: z.union([z.instanceof(File), z.string().url(), z.null()]),
})

export type TipFormValues = z.infer<typeof TipFormSchema>
