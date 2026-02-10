import { z } from 'zod'

export const ExperienceItineraryFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.union([z.instanceof(File), z.string().url(), z.null()]),
  order: z.number().int().min(0),
})

export type ExperienceItineraryFormValues = z.infer<typeof ExperienceItineraryFormSchema>
