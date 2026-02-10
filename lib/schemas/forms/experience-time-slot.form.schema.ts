import { z } from 'zod'

export const ExperienceTimeSlotFormSchema = z.object({
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
})

export type ExperienceTimeSlotFormValues = z.infer<typeof ExperienceTimeSlotFormSchema>
