import { z } from 'zod'

export const DAYS_OF_WEEK = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const

const TimeSlotSchema = z
  .object({
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
  })
  .refine(data => !data.startTime || !data.endTime || data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  })

export const ScheduleTabSchema = z.object({
  operatingDays: z.record(z.enum(DAYS_OF_WEEK), z.boolean()),
  timeSlots: z.array(TimeSlotSchema).min(1, 'At least one time slot is required'),
})

export type ScheduleTabValues = z.infer<typeof ScheduleTabSchema>
