import { z } from 'zod'

export const StayTabSchema = z.object({
  // Basics
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  cover: z.union([z.instanceof(File), z.string(), z.null()]),
  localityId: z.string().min(1, 'Locality is required'),
  ownerId: z.string().min(1, 'Owner is required'),
  categoryIds: z.array(z.string()).optional(),

  // Location
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  latitude: z.number(),
  longitude: z.number(),

  // Details
  included: z.string(),
  notIncluded: z.string(),
  cancellationTerms: z.string(),

  // Stay-specific
  maxPeople: z.number().int().min(1, 'Max people is required'),
  bedNumber: z.number().int().min(1, 'Bed number is required'),
  bathroomNumber: z.number().int().min(0),
  roomNumber: z.number().int().min(1),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  amenities: z.array(z.string()),
  houseRules: z.string(),
  cir: z.string().min(1, 'CIR is required'),
  cin: z.string().min(1, 'CIN is required'),

  // Status
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'PAUSED', 'ARCHIVED']).nullish(),

  // Highlighted
  highlighted: z.boolean(),
})

export type StayTabValues = z.infer<typeof StayTabSchema>
