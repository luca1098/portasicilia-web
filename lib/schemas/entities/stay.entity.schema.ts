import { z } from 'zod'
import {
  CommissionTypeSchema,
  ListingStatusSchema,
  ExperienceImageSchema,
  ExperienceItinerarySchema,
  ReviewSchema,
} from './experience.entity.schema'
import { OwnerSchema } from './owner.entity.schema'
import { PriceListSchema } from './pricing.entity.schema'

// ==================== SUB-ENTITIES ====================

export const StayAvailabilitySchema = z.object({
  id: z.string(),
  dateFrom: z.string(),
  dateTo: z.string(),
  available: z.boolean(),
  source: z.string().optional(),
})

export type StayAvailability = z.infer<typeof StayAvailabilitySchema>

export const StayDetailSchema = z.object({
  id: z.string(),
  maxPeople: z.number().int(),
  bedNumber: z.number().int(),
  houseRules: z.array(z.string()),
  cir: z.string(),
  cin: z.string(),
  bathroomNumber: z.number().int(),
  roomNumber: z.number().int(),
  checkInTime: z.string().nullable(),
  checkOutTime: z.string().nullable(),
  amenities: z.array(z.string()),
  icsUrl: z.string().nullable().optional(),
  icsSyncedAt: z.string().nullable().optional(),
  icsSyncError: z.string().nullable().optional(),
  icsExportToken: z.string().nullable().optional(),
  availability: z.array(StayAvailabilitySchema).nullish(),
})

export type StayDetail = z.infer<typeof StayDetailSchema>

// ==================== STAY ====================

export const StaySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  cover: z.string().nullable(),
  street: z.string(),
  city: z.string(),
  zipCode: z.string(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  included: z.array(z.string()),
  notIncluded: z.array(z.string()),
  policy: z.array(z.string()),
  cancellationTerms: z.array(z.string()),
  status: ListingStatusSchema,
  highlighted: z.boolean().optional(),
  ownerId: z.string(),
  owner: OwnerSchema.nullish(),
  localityId: z.string(),
  categories: z
    .array(
      z.object({
        category: z.object({ id: z.string(), name: z.string(), icon: z.string().nullable().optional() }),
      })
    )
    .nullish(),
  maxPeople: z.number().int().nullable().optional(),
  bedNumber: z.number().int().nullable().optional(),
  houseRules: z.array(z.string()).nullish(),
  cir: z.string().nullable().optional(),
  cin: z.string().nullable().optional(),
  bathroomNumber: z.number().int().nullable().optional(),
  roomNumber: z.number().int().nullable().optional(),
  checkInTime: z.string().nullable().optional(),
  checkOutTime: z.string().nullable().optional(),
  amenities: z.array(z.string()).nullish(),
  stayDetail: StayDetailSchema.nullish(),
  availability: z.array(StayAvailabilitySchema).nullish(),
  commissionType: CommissionTypeSchema.nullable(),
  commissionValue: z.number().nullable(),
  depositValue: z.number().nullable().optional(),
  images: z.array(ExperienceImageSchema).nullish(),
  itinerary: z.array(ExperienceItinerarySchema).nullish(),
  priceLists: z.array(PriceListSchema).nullish(),
  reviews: z.array(ReviewSchema).nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Stay = z.infer<typeof StaySchema>
