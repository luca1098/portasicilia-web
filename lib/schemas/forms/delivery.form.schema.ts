import { z } from 'zod'

export const deliveryFormSchema = z.object({
  region: z.string().min(1, 'Region is required'),
  street: z.string().min(1, 'Street is required'),
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
  city: z.string().min(1, 'City is required'),
  province: z
    .string()
    .min(1, 'Province is required')
    .regex(/^[A-Z]{2}$/i, 'Province must be 2 letters'),
  notes: z.string().max(500).optional().or(z.literal('')),
})

export type DeliveryFormValues = z.infer<typeof deliveryFormSchema>

export const deliveryFormDefaults: DeliveryFormValues = {
  region: '',
  street: '',
  zipCode: '',
  city: '',
  province: '',
  notes: '',
}
