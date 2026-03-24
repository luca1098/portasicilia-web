import { z } from 'zod'
import { AuthorSchema } from './author.entity.schema'
import { CategorySchema } from './category.entity.schema'

const LocalityRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
})

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  cover: z.string().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  publishedAt: z.string().nullable(),
  authorId: z.string(),
  author: AuthorSchema.optional(),
  categoryId: z.string().nullable(),
  category: CategorySchema.nullable().optional(),
  localityId: z.string().nullable(),
  locality: LocalityRefSchema.nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Article = z.infer<typeof ArticleSchema>
