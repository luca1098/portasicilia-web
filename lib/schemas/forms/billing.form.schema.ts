import { z } from 'zod'

const billingTypeEnum = z.enum(['PRIVATE', 'COMPANY'])

const baseBillingSchema = z.object({
  billingType: billingTypeEnum,
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().min(1, 'Phone number is required'),
  fiscalCode: z.string(),
  companyName: z.string(),
  vatNumber: z.string(),
  sdiCode: z.string(),
  pec: z.string(),
  streetAddress: z.string(),
  city: z.string(),
  zipCode: z.string(),
  province: z.string(),
  country: z.string(),
})

export function createBillingFormSchema(sdiOrPecMessage: string) {
  return baseBillingSchema.superRefine((data, ctx) => {
    if (data.billingType === 'PRIVATE') {
      if (!data.firstName.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'First name is required',
          path: ['firstName'],
        })
      }
      if (!data.lastName.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Last name is required',
          path: ['lastName'],
        })
      }
      return
    }

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
    if (!data.streetAddress.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Street address is required',
        path: ['streetAddress'],
      })
    }
    if (!data.city.trim()) {
      ctx.addIssue({ code: 'custom', message: 'City is required', path: ['city'] })
    }
    if (!/^\d{5}$/.test(data.zipCode)) {
      ctx.addIssue({
        code: 'custom',
        message: 'ZIP code must be 5 digits',
        path: ['zipCode'],
      })
    }
    if (!/^[A-Z]{2}$/i.test(data.province)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Province must be 2 letters',
        path: ['province'],
      })
    }
    if (!data.country.trim()) {
      ctx.addIssue({ code: 'custom', message: 'Country is required', path: ['country'] })
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
  })
}

export type BillingFormValues = z.infer<typeof baseBillingSchema>

/** Maps frontend form values to backend BillingDto field names */
export function mapBillingToDto(values: BillingFormValues) {
  const isCompany = values.billingType === 'COMPANY'
  return {
    billingType: values.billingType,
    firstName: isCompany ? values.companyName : values.firstName,
    lastName: isCompany ? '' : values.lastName,
    contactPhone: values.phone,
    fiscalCode: isCompany ? undefined : undefined,
    street: isCompany ? values.streetAddress : undefined,
    city: isCompany ? values.city : undefined,
    zipCode: isCompany ? values.zipCode : undefined,
    province: isCompany ? values.province : undefined,
    country: isCompany ? values.country : undefined,
    companyName: isCompany ? values.companyName || undefined : undefined,
    vatNumber: isCompany ? values.vatNumber || undefined : undefined,
    recipientCode: isCompany ? values.sdiCode || undefined : undefined,
    pecEmail: isCompany ? values.pec || undefined : undefined,
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
