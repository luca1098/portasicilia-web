import { z } from 'zod'

const optionalUrl = z
  .string()
  .trim()
  .url('partner_form_url_invalid')
  .optional()
  .or(z.literal('').transform(() => undefined))

export const partnerApplicationSchema = z.object({
  listingInterests: z.array(z.enum(['EXPERIENCE', 'STAY'])).min(1, 'partner_form_listing_types_required'),
  businessName: z.string().trim().min(2, 'partner_form_min_length').max(200, 'partner_form_max_length'),
  vatNumber: z
    .string()
    .trim()
    .max(50, 'partner_form_max_length')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  website: optionalUrl,
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  firstName: z.string().trim().min(1, 'partner_form_required').max(100, 'partner_form_max_length'),
  lastName: z.string().trim().min(1, 'partner_form_required').max(100, 'partner_form_max_length'),
  email: z.string().trim().toLowerCase().email('partner_form_email_invalid'),
  phone: z.string().trim().min(5, 'partner_form_min_length').max(30, 'partner_form_max_length'),
  role: z
    .string()
    .trim()
    .max(100, 'partner_form_max_length')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  locality: z.string().trim().min(2, 'partner_form_min_length').max(100, 'partner_form_max_length'),
  description: z.string().trim().min(20, 'partner_form_min_length').max(500, 'partner_form_max_length'),
  pitch: z.string().trim().min(20, 'partner_form_min_length').max(500, 'partner_form_max_length'),
  referralSource: z.enum(['GOOGLE', 'SOCIAL', 'WORD_OF_MOUTH', 'OTHER']).optional(),
  gdprConsent: z.literal(true, { error: 'partner_form_gdpr_required' }),
  applicantLang: z.enum(['IT', 'EN']),
})

export type PartnerApplicationFormValues = z.infer<typeof partnerApplicationSchema>
