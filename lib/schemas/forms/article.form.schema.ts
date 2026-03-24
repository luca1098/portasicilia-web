import { z } from 'zod'

export const ArticleFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required').max(300),
  content: z.string().min(1, 'Content is required'),
  cover: z.union([z.instanceof(File), z.string().url(), z.null()]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  authorId: z.string().min(1, 'Author is required'),
  categoryId: z.string().optional().or(z.literal('')),
  localityId: z.string().optional().or(z.literal('')),
})

export type ArticleFormValues = z.infer<typeof ArticleFormSchema>
