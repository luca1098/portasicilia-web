import { z } from 'zod'

export const ExperienceImageFormSchema = z.object({
  image: z.instanceof(File, { message: 'Image is required' }),
  order: z.number().int().min(0),
})

export type ExperienceImageFormValues = z.infer<typeof ExperienceImageFormSchema>
