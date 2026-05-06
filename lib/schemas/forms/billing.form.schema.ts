import { z } from 'zod'

const billingTypeEnum = z.enum(['PRIVATE', 'COMPANY'])

const baseBillingSchema = z.object({
  billingType: billingTypeEnum,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  fiscalCode: z
    .string()
    .min(1, 'Fiscal code is required')
    .regex(/^[A-Z0-9]{16}$/i, 'Fiscal code must be 16 alphanumeric characters'),
  companyName: z.string(),
  vatNumber: z.string(),
  sdiCode: z.string(),
  pec: z.string(),
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
  province: z
    .string()
    .min(1, 'Province is required')
    .regex(/^[A-Z]{2}$/i, 'Province must be 2 letters'),
  country: z.string().min(1, 'Country is required'),
})

export function createBillingFormSchema(sdiOrPecMessage: string) {
  return baseBillingSchema.superRefine((data, ctx) => {
    if (data.billingType === 'COMPANY') {
      if (!data.companyName.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Company name is required',
          path: ['companyName'],
        })
      }
      if (!/^\d{11}$/.test(data.vatNumber)) {
        ctx.addIssue({
          code: 'custom',
          message: 'VAT number must be 11 digits',
          path: ['vatNumber'],
        })
      }
      const hasSdi = /^[A-Z0-9]{7}$/i.test(data.sdiCode)
      const hasPec = data.pec.trim().length > 0 && z.string().email().safeParse(data.pec).success
      if (!hasSdi && !hasPec) {
        ctx.addIssue({
          code: 'custom',
          message: sdiOrPecMessage,
          path: ['sdiCode'],
        })
      }
    }
  })
}

export type BillingFormValues = z.infer<typeof baseBillingSchema>

/** Maps frontend form values to backend BillingDto field names */
export function mapBillingToDto(values: BillingFormValues) {
  return {
    billingType: values.billingType,
    firstName: values.firstName,
    lastName: values.lastName,
    contactPhone: values.phone,
    fiscalCode: values.fiscalCode,
    street: values.streetAddress,
    city: values.city,
    zipCode: values.zipCode,
    province: values.province,
    country: values.country,
    companyName: values.companyName || undefined,
    vatNumber: values.vatNumber || undefined,
    recipientCode: values.sdiCode || undefined,
    pecEmail: values.pec || undefined,
  }
}

export const billingFormDefaults: BillingFormValues = {
  billingType: 'PRIVATE',
  firstName: '',
  lastName: '',
  phone: '',
  fiscalCode: '',
  companyName: '',
  vatNumber: '',
  sdiCode: '',
  pec: '',
  streetAddress: '',
  city: '',
  zipCode: '',
  province: '',
  country: 'IT',
}
