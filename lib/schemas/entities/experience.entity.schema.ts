import { z } from 'zod'

// ==================== ENUMS ====================

export const ListingStatusSchema = z.union([
  z.literal('DRAFT'),
  z.literal('PENDING_REVIEW'),
  z.literal('ACTIVE'),
  z.literal('PAUSED'),
  z.literal('ARCHIVED'),
])

export type ListingStatus = z.infer<typeof ListingStatusSchema>

export const PriceTypeSchema = z.union([z.literal('PER_PERSON'), z.literal('PER_EXPERIENCE')])

export type PriceType = z.infer<typeof PriceTypeSchema>

export const PersonTypeSchema = z.union([z.literal('ADULT'), z.literal('CHILD'), z.literal('INFANT')])

export type PersonType = z.infer<typeof PersonTypeSchema>

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

export const TimeSlotPriceSchema = z.object({
  id: z.string(),
  price: z.number(),
  personType: PersonTypeSchema.nullable(),
  createdAt: z.string(),
})

export type TimeSlotPrice = z.infer<typeof TimeSlotPriceSchema>

export const ExperienceTimeSlotSchema = z.object({
  id: z.string(),
  dayOfWeek: DayOfWeekSchema,
  startTime: z.string(),
  endTime: z.string(),
  capacity: z.number(),
  prices: z.array(TimeSlotPriceSchema).nullish(),
  createdAt: z.string(),
})

export type ExperienceTimeSlot = z.infer<typeof ExperienceTimeSlotSchema>

export const ExperienceAvailabilitySchema = z.object({
  id: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  capacity: z.number(),
  isAvailable: z.boolean(),
  createdAt: z.string(),
})

export type ExperienceAvailability = z.infer<typeof ExperienceAvailabilitySchema>

export const ExperienceCustomPriceSchema = z.object({
  id: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  price: z.number(),
  personType: PersonTypeSchema.nullable(),
  createdAt: z.string(),
})

export type ExperienceCustomPrice = z.infer<typeof ExperienceCustomPriceSchema>

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
  priceType: PriceTypeSchema,
  street: z.string(),
  city: z.string(),
  zipCode: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  included: z.array(z.string()),
  notIncluded: z.array(z.string()),
  policy: z.array(z.string()),
  cancellationTerms: z.array(z.string()),
  languages: z.array(z.string()),
  status: ListingStatusSchema,
  isActive: z.boolean(),
  ownerId: z.string(),
  localityId: z.string(),
  images: z.array(ExperienceImageSchema).nullish(),
  itinerary: z.array(ExperienceItinerarySchema).nullish(),
  timeSlots: z.array(ExperienceTimeSlotSchema).nullish(),
  availabilities: z.array(ExperienceAvailabilitySchema).nullish(),
  customPrices: z.array(ExperienceCustomPriceSchema).nullish(),
  reviews: z.array(ReviewSchema).nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Experience = z.infer<typeof ExperienceSchema>
