'use client'

import { useFormContext } from 'react-hook-form'
import { useTranslation } from '@/lib/context/translation.context'
import { InputFormField } from '@/components/form/input-form-field'
import type { PartnerApplicationFormValues } from '@/lib/schemas/partner-application.schema'

export default function ApplicationWizardStep1() {
  const t = useTranslation()
  const {
    register,
    formState: { errors },
  } = useFormContext<PartnerApplicationFormValues>()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium">{t.partner_form_listing_types_label}</p>
        <div className="mt-2 flex gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded border px-4 py-2">
            <input type="checkbox" value="EXPERIENCE" {...register('listingInterests')} />
            <span>{t.partner_form_listing_type_experience}</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded border px-4 py-2">
            <input type="checkbox" value="STAY" {...register('listingInterests')} />
            <span>{t.partner_form_listing_type_stay}</span>
          </label>
        </div>
        {errors.listingInterests && (
          <p className="mt-1 text-sm text-destructive">{errors.listingInterests.message}</p>
        )}
      </div>

      <section>
        <h3 className="font-semibold">{t.partner_form_business_section}</h3>
        <div className="mt-3 space-y-3">
          <InputFormField<PartnerApplicationFormValues>
            name="businessName"
            label={t.partner_form_business_name}
          />
          <InputFormField<PartnerApplicationFormValues> name="vatNumber" label={t.partner_form_vat_number} />
          <InputFormField<PartnerApplicationFormValues> name="website" label={t.partner_form_website} />
        </div>
      </section>

      <section>
        <h3 className="font-semibold">{t.partner_form_socials_section}</h3>
        <div className="mt-3 space-y-3">
          <InputFormField<PartnerApplicationFormValues>
            name="instagramUrl"
            label={t.partner_form_instagram_url}
          />
          <InputFormField<PartnerApplicationFormValues>
            name="facebookUrl"
            label={t.partner_form_facebook_url}
          />
          <InputFormField<PartnerApplicationFormValues> name="tiktokUrl" label={t.partner_form_tiktok_url} />
        </div>
      </section>
    </div>
  )
}
