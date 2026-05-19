'use client'

import { useTranslation } from '@/lib/context/translation.context'
import { InputFormField } from '@/components/form/input-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { SelectFormField } from '@/components/form/select-form-field'
import { CheckboxFormField } from '@/components/form/checkbox-form-field'
import type { PartnerApplicationFormValues } from '@/lib/schemas/partner-application.schema'

type ReferralOption = { value: string; label: string }

export default function ApplicationWizardStep3() {
  const t = useTranslation()
  const referralOptions: ReferralOption[] = [
    { value: 'GOOGLE', label: t.partner_form_referral_google },
    { value: 'SOCIAL', label: t.partner_form_referral_social },
    { value: 'WORD_OF_MOUTH', label: t.partner_form_referral_word_of_mouth },
    { value: 'OTHER', label: t.partner_form_referral_other },
  ]
  return (
    <div className="space-y-5">
      <InputFormField<PartnerApplicationFormValues>
        name="locality"
        label={t.partner_form_locality}
        description={t.partner_form_locality_hint}
      />
      <TextareaFormField<PartnerApplicationFormValues>
        name="description"
        label={t.partner_form_description}
        description={t.partner_form_description_hint}
        rows={3}
        maxLength={500}
      />

      <div className="rounded border-l-4 border-amber-500 bg-amber-50 p-4">
        <TextareaFormField<PartnerApplicationFormValues>
          name="pitch"
          label={t.partner_form_pitch}
          description={t.partner_form_pitch_hint}
          rows={4}
          maxLength={500}
        />
      </div>

      <SelectFormField<PartnerApplicationFormValues, ReferralOption>
        name="referralSource"
        label={t.partner_form_referral_label}
        options={referralOptions}
        getValue={o => o.value}
        getLabel={o => o.label}
      />

      <CheckboxFormField<PartnerApplicationFormValues>
        name="gdprConsent"
        label={t.partner_form_gdpr_consent}
        required
      />
    </div>
  )
}
