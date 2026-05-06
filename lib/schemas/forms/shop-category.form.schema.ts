import { z } from 'zod'

export const ShopCategoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().max(500).optional().or(z.literal('')),
  icon: z.string().optional().or(z.literal('')),
  cover: z.union([z.instanceof(File), z.string().url(), z.null()]),
  sortOrder: z.coerce.number<number>().int().min(0),
})

export type ShopCategoryFormValues = z.infer<typeof ShopCategoryFormSchema>
