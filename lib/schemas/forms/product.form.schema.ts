import { z } from 'zod'

export const ProductVariantFormSchema = z.object({
  id: z.string().optional(),
  volume: z.coerce.number<number>().min(0.01, 'Volume is required'),
  unitOfMeasurement: z.string().min(1, 'Unit is required'),
  price: z.coerce.number<number>().min(0.01, 'Price is required'),
  compareAtPrice: z.coerce.number<number>().optional(),
  stock: z.coerce.number<number>().int().min(0),
  maxQuantityPerOrder: z.coerce.number<number>().int().min(1),
  commissionType: z.enum(['PERCENTAGE', 'FLAT']).optional(),
  commissionValue: z.coerce.number<number>().min(0).optional(),
})

export type ProductVariantFormValues = z.infer<typeof ProductVariantFormSchema>

const ProductBaseFields = {
  name: z.string().min(1, 'Name is required'),
  shortDescription: z.string().max(500).optional().or(z.literal('')),
  description: z.string().max(5000).optional().or(z.literal('')),
  categoryId: z.string().optional().or(z.literal('')),
  ownerId: z.string().optional().or(z.literal('')),
  cover: z.union([z.instanceof(File), z.string().url(), z.null()]),
  highlighted: z.boolean(),
  active: z.boolean(),
}

export const ProductCreateFormSchema = z.object({
  ...ProductBaseFields,
  variants: z.array(ProductVariantFormSchema),
})

export const ProductFormSchema = z.object({
  ...ProductBaseFields,
  variants: z.array(ProductVariantFormSchema).min(1, 'At least one variant is required'),
})

export type ProductFormValues = z.infer<typeof ProductFormSchema>
