import { z } from 'zod'
import { UserEntitySchema } from './user.entity.schema'

export const OwnerDeletionPreviewSchema = z.object({
  owner: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  counts: z.object({
    experiences: z.number().optional(),
    stays: z.number().optional(),
    products: z.number().optional(),
    bookings: z.number().optional(),
    orders: z.number().optional(),
    reviews: z.number().optional(),
    priceLists: z.number().optional(),
    media: z.number().optional(),
  }),
})

export type OwnerDeletionPreview = z.infer<typeof OwnerDeletionPreviewSchema>

export const OwnerSchema = UserEntitySchema.pick({
  lastName: true,
  firstName: true,
  id: true,
  email: true,
  avatar: true,
})

export type Owner = z.infer<typeof OwnerSchema>

export const AdminOwnerSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().nullable().optional(),
  businessName: z.string().nullable().optional(),
  vatNumber: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  isManuallyCreated: z.boolean(),
  claimedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  experienceCount: z.number().optional(),
  stayCount: z.number().optional(),
  productCount: z.number().optional(),
})

export type AdminOwner = z.infer<typeof AdminOwnerSchema>

export type AdminOwnerListResponse = {
  data: AdminOwner[]
  total: number
  page: number
  limit: number
}
