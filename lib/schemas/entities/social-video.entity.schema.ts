import { z } from 'zod'

export const SocialVideoListingSchema = z.object({
  id: z.string(),
  type: z.enum(['EXPERIENCE', 'STAY']),
  slug: z.string(),
  name: z.string(),
  cover: z.string().nullable().optional(),
})

export type SocialVideoListing = z.infer<typeof SocialVideoListingSchema>

export const SocialVideoSchema = z.object({
  id: z.string(),
  url: z.string(),
  title: z.string().nullable(),
  sortOrder: z.number(),
  active: z.boolean(),
  featured: z.boolean(),
  listingId: z.string().nullable().optional(),
  listing: SocialVideoListingSchema.nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type SocialVideo = z.infer<typeof SocialVideoSchema>
