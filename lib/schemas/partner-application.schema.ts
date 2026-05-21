import { z } from 'zod'
import { interpolate } from '@/lib/utils/i18n.utils'

type Translations = {
  partner_form_url_invalid: string
  partner_form_listing_types_required: string
  partner_form_min_length: string
  partner_form_max_length: string
  partner_form_required: string
  partner_form_email_invalid: string
  partner_form_gdpr_required: string
  partner_form_partner_terms_required: string
}

export const createPartnerApplicationSchema = (t: Translations) => {
  const minMsg = (min: number) => interpolate(t.partner_form_min_length, { min })
  const maxMsg = (max: number) => interpolate(t.partner_form_max_length, { max })

  const optionalUrl = z
    .string()
    .trim()
    .url(t.partner_form_url_invalid)
    .optional()
    .or(z.literal('').transform(() => undefined))

  return z.object({
    listingInterests: z.array(z.enum(['EXPERIENCE', 'STAY'])).min(1, t.partner_form_listing_types_required),
    businessName: z.string().trim().min(2, minMsg(2)).max(200, maxMsg(200)),
    vatNumber: z
      .string()
      .trim()
      .max(50, maxMsg(50))
      .optional()
      .or(z.literal('').transform(() => undefined)),
    website: optionalUrl,
    instagramUrl: optionalUrl,
    facebookUrl: optionalUrl,
    tiktokUrl: optionalUrl,
    firstName: z.string().trim().min(1, t.partner_form_required).max(100, maxMsg(100)),
    lastName: z.string().trim().min(1, t.partner_form_required).max(100, maxMsg(100)),
    email: z.string().trim().toLowerCase().email(t.partner_form_email_invalid),
    phone: z.string().trim().min(5, minMsg(5)).max(30, maxMsg(30)),
    role: z
      .string()
      .trim()
      .max(100, maxMsg(100))
      .optional()
      .or(z.literal('').transform(() => undefined)),
    locality: z.string().trim().min(2, minMsg(2)).max(100, maxMsg(100)),
    description: z.string().trim().min(20, minMsg(20)).max(500, maxMsg(500)),
    pitch: z.string().trim().min(20, minMsg(20)).max(500, maxMsg(500)),
    referralSource: z.enum(['GOOGLE', 'SOCIAL', 'WORD_OF_MOUTH', 'OTHER']).optional(),
    gdprConsent: z.literal(true, { error: t.partner_form_gdpr_required }),
    partnerTermsConsent: z.literal(true, { error: t.partner_form_partner_terms_required }),
    applicantLang: z.enum(['IT', 'EN']),
  })
}

export type PartnerApplicationFormValues = z.infer<ReturnType<typeof createPartnerApplicationSchema>>
