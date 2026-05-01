import { z } from 'zod'
import { ReviewSchema } from './experience.entity.schema'
import { OwnerSchema } from './owner.entity.schema'

export const ProductVariantSchema = z.object({
  id: z.string(),
  volume: z.number(),
  unitOfMeasurement: z.string(),
  price: z.number(),
  compareAtPrice: z.number().nullable(),
  stock: z.number(),
  maxQuantityPerOrder: z.number(),
  commissionType: z.enum(['PERCENTAGE', 'FLAT']).nullable().optional(),
  commissionValue: z.union([z.string(), z.number()]).nullable().optional(),
})

export type ProductVariant = z.infer<typeof ProductVariantSchema>

export const ProductImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  order: z.number(),
  createdAt: z.string(),
})

export type ProductImage = z.infer<typeof ProductImageSchema>

export const ShopCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  cover: z.string().nullable(),
  sortOrder: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type ShopCategory = z.infer<typeof ShopCategorySchema>

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  shortDescription: z.string().nullable(),
  description: z.string().nullable(),
  cover: z.string().nullable(),
  images: z.array(ProductImageSchema),
  highlighted: z.boolean(),
  active: z.boolean(),
  categoryId: z.string().nullable(),
  category: ShopCategorySchema.nullable().optional(),
  ownerId: z.string().nullable().optional(),
  owner: OwnerSchema.nullable().optional(),
  variants: z.array(ProductVariantSchema),
  reviews: z.array(ReviewSchema).nullish(),
  googleRating: z.number().nullish(),
  googleRatingCount: z.number().nullish(),
  googleBusinessUrl: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
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

export type Product = z.infer<typeof ProductSchema>
