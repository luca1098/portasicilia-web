import { z } from 'zod'

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  cover: z.string().nullable(),
  highlighted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  translationStatus: z
    .object({
      status: z.enum(['complete', 'partial', 'pending', 'failed', 'none']),
      locales: z.record(
        z.string(),
        z.object({
          status: z.enum(['complete', 'partial', 'pending', 'failed', 'none']),
          completed: z.number(),
          total: z.number(),
        })
      ),
    })
    .optional(),
})

export type Category = z.infer<typeof CategorySchema>
