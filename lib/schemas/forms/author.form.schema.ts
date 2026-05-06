import { z } from 'zod'

export const AuthorFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().max(500).optional().or(z.literal('')),
  avatar: z.union([z.instanceof(File), z.string().url(), z.null()]),
})

export type AuthorFormValues = z.infer<typeof AuthorFormSchema>
