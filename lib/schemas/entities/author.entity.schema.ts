import { z } from 'zod'

export const AuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  bio: z.string().nullable(),
  avatar: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  _count: z
    .object({
      articles: z.number(),
    })
    .optional(),
})

export type Author = z.infer<typeof AuthorSchema>
