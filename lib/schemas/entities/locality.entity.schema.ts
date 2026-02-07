import { z } from 'zod'

export const LocalitySchema = z.object({
  id: z.string(),
  name: z.string(),
  cover: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Locality = z.infer<typeof LocalitySchema>
