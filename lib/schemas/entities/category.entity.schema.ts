import { z } from 'zod'

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: z.union([z.literal('EXPERIENCE'), z.literal('STAY')]),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  cover: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Category = z.infer<typeof CategorySchema>
