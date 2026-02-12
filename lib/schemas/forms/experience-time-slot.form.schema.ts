import { z } from 'zod'

export const ExperienceTimeSlotFormSchema = z
  .object({
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
  })
  .refine(data => !data.startTime || !data.endTime || data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  })

export type ExperienceTimeSlotFormValues = z.infer<typeof ExperienceTimeSlotFormSchema>
