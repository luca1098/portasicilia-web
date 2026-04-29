import { z } from 'zod'

export const AdminReviewFormSchema = z.object({
  listingType: z.enum(['experience', 'stay']),
  listingId: z.string().uuid('Seleziona un listing valido'),
  rating: z.coerce.number<number>().int().min(1).max(5),
  authorName: z.string().min(1, 'Nome autore obbligatorio').max(120),
  authorImage: z.union([z.instanceof(File), z.string().url(), z.null()]).optional(),
  title: z.string().max(200).optional().or(z.literal('')),
  comment: z.string().max(2000).optional().or(z.literal('')),
})

export type AdminReviewFormValues = z.infer<typeof AdminReviewFormSchema>
