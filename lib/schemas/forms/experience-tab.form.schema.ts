import { z } from 'zod'

const CAPACITY_MODES = ['PER_PERSON', 'PER_ASSET'] as const

export const ExperienceTabSchema = z.object({
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
  policy: z.string(),
  cancellationTerms: z.string(),
  languages: z.string(),

  // Capacity (sent with experience, not pricing)
  capacityMode: z.enum(CAPACITY_MODES),
  maxCapacity: z.number().int().min(1, 'Capacity is required'),
  assetLabel: z.string().optional(),

  // Status
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'PAUSED', 'ARCHIVED']).nullish(),

  // Highlighted
  highlighted: z.boolean(),
})

export type ExperienceTabValues = z.infer<typeof ExperienceTabSchema>
