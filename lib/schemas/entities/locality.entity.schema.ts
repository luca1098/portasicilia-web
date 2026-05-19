import { z } from 'zod'
import { TipSchema } from './tips.entity.schema'

export const LocalitySchema = z.object({
  id: z.string(),
  name: z.string(),
  cover: z.string().nullish(),
  slug: z.string(),
  state: z.string().nullish(),
  description: z.string().nullish(),
  highlighted: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  tips: z.array(TipSchema).nullish(),
  _translated: z.boolean().optional(),
  _originals: z.record(z.string(), z.unknown()).optional(),
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

export type Locality = z.infer<typeof LocalitySchema>
