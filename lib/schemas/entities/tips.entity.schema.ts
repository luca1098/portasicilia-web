import { z } from 'zod'

export const TipSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  cover: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Tip = z.infer<typeof TipSchema>
