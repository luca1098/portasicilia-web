'use client'

import { useTranslation } from '@/lib/context/translation.context'
import { InputFormField } from '@/components/form/input-form-field'
import { PhoneFormField } from '@/components/form/phone-form-field'
import type { PartnerApplicationFormValues } from '@/lib/schemas/partner-application.schema'

export default function ApplicationWizardStep2() {
  const t = useTranslation()
  return (
    <div className="space-y-4">
      <InputFormField<PartnerApplicationFormValues> name="firstName" label={t.partner_form_first_name} />
      <InputFormField<PartnerApplicationFormValues> name="lastName" label={t.partner_form_last_name} />
      <InputFormField<PartnerApplicationFormValues> name="email" label={t.partner_form_email} type="email" />
      <PhoneFormField<PartnerApplicationFormValues> name="phone" label={t.partner_form_phone} />
      <InputFormField<PartnerApplicationFormValues>
        name="role"
        label={t.partner_form_role_label}
        placeholder={t.partner_form_role_placeholder}
      />
    </div>
  )
}
