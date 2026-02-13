import { z } from 'zod'
import { OwnerSchema } from './owner.entity.schema'
import { PriceListSchema } from './pricing.entity.schema'

// ==================== ENUMS ====================

export const CommissionTypeSchema = z.union([z.literal('PERCENTAGE'), z.literal('FLAT')])

export type CommissionType = z.infer<typeof CommissionTypeSchema>

export const ListingStatusSchema = z.union([
  z.literal('DRAFT'),
  z.literal('PENDING_REVIEW'),
  z.literal('ACTIVE'),
  z.literal('PAUSED'),
  z.literal('ARCHIVED'),
])

export type ListingStatus = z.infer<typeof ListingStatusSchema>

export const DayOfWeekSchema = z.union([
  z.literal('MONDAY'),
  z.literal('TUESDAY'),
  z.literal('WEDNESDAY'),
  z.literal('THURSDAY'),
  z.literal('FRIDAY'),
  z.literal('SATURDAY'),
  z.literal('SUNDAY'),
])

export type DayOfWeek = z.infer<typeof DayOfWeekSchema>

// ==================== SUB-ENTITIES ====================

export const ExperienceImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  order: z.number(),
  createdAt: z.string(),
})

export type ExperienceImage = z.infer<typeof ExperienceImageSchema>

export const ExperienceItinerarySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().nullable(),
  order: z.number(),
  createdAt: z.string(),
})

export type ExperienceItinerary = z.infer<typeof ExperienceItinerarySchema>

export const CapacityModeSchema = z.union([z.literal('PER_PERSON'), z.literal('PER_ASSET')])

export type CapacityMode = z.infer<typeof CapacityModeSchema>

export const PricingModeSchema = z.union([
  z.literal('PER_PERSON'),
  z.literal('PER_EXPERIENCE'),
  z.literal('PER_ASSET'),
])

export type PricingMode = z.infer<typeof PricingModeSchema>

export const ExperienceTimeSlotSchema = z.object({
  id: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  durationInMinutes: z.number().int(),
  createdAt: z.string(),
})

export type ExperienceTimeSlot = z.infer<typeof ExperienceTimeSlotSchema>

export const ReviewSchema = z.object({
  id: z.string(),
  rating: z.number(),
  comment: z.string().nullable(),
  reply: z.string().nullable(),
  userId: z.string(),
  userName: z.string().nullish(),
  userImage: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Review = z.infer<typeof ReviewSchema>

// ==================== EXPERIENCE ====================

export const ExperienceSchema = z.object({
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
  maxCapacity: z.number().int(),
  capacityMode: CapacityModeSchema.optional(),
  assetLabel: z.string().nullable().optional(),
  pricingMode: PricingModeSchema.optional(),
  languages: z.array(z.string()),
  status: ListingStatusSchema,
  highlighted: z.boolean().optional(),
  ownerId: z.string(),
  owner: OwnerSchema.nullish(),
  localityId: z.string(),
  categories: z.array(z.object({ category: z.object({ id: z.string(), name: z.string() }) })).nullish(),
  daysOfWeek: z.array(DayOfWeekSchema).nullish(),
  commissionType: CommissionTypeSchema.nullable(),
  commissionValue: z.number().nullable(),
  images: z.array(ExperienceImageSchema).nullish(),
  itinerary: z.array(ExperienceItinerarySchema).nullish(),
  timeSlots: z.array(ExperienceTimeSlotSchema).nullish(),
  priceLists: z.array(PriceListSchema).nullish(),
  reviews: z.array(ReviewSchema).nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Experience = z.infer<typeof ExperienceSchema>
