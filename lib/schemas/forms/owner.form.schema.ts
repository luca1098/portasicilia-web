import { z } from 'zod'

export const OwnerFormSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional().or(z.literal('')),
  businessName: z.string().optional().or(z.literal('')),
  vatNumber: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})

export type OwnerFormValues = z.infer<typeof OwnerFormSchema>
