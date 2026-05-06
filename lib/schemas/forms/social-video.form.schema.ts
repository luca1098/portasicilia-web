import { z } from 'zod'

export const SocialVideoFormSchema = z.object({
  url: z.string().min(1),
  title: z.string().optional(),
  active: z.boolean(),
  featured: z.boolean(),
  listingId: z.string().nullable().optional(),
})

export type SocialVideoFormValues = z.infer<typeof SocialVideoFormSchema>
