import { z } from 'zod'
import { TipSchema } from './tips.entity.schema'

export const LocalitySchema = z.object({
  id: z.string(),
  name: z.string(),
  cover: z.string().nullish(),
  slug: z.string(),
  highlighted: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  tips: z.array(TipSchema).nullish(),
})

export type Locality = z.infer<typeof LocalitySchema>
