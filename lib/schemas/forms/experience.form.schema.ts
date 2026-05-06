import { z } from 'zod'

export const ExperienceFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  cover: z.union([z.instanceof(File), z.string().url(), z.null()]),
  maxCapacity: z.number().int().min(1, 'Max capacity is required'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  latitude: z.number(),
  longitude: z.number(),
  included: z.string(),
  notIncluded: z.string(),
  policy: z.string(),
  cancellationTerms: z.string(),
  languages: z.string(),
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'PAUSED', 'ARCHIVED']),
  localityId: z.string().min(1, 'Locality is required'),
  ownerId: z.string().min(1, 'Owner is required'),
})

export type ExperienceFormValues = z.infer<typeof ExperienceFormSchema>
