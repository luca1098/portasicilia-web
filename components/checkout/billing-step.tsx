'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import { useFormContext, useWatch } from 'react-hook-form'

import { ComboboxFormField } from '@/components/form/combobox-form-field'
import { InputFormField } from '@/components/form/input-form-field'
import { PhoneFormField } from '@/components/form/phone-form-field'
import { RadioFormField } from '@/components/form/radio-form-field'
import { useTranslation } from '@/lib/context/translation.context'
import { getCountryOptions, CountryFlag, type CountryOption } from '@/lib/constants/countries'
import { cn } from '@/lib/utils/shadcn.utils'
import type { BillingFormValues } from '@/lib/schemas/forms/billing.form.schema'

type BillingType = 'PRIVATE' | 'COMPANY'

const billingTypeOptions: {
  value: BillingType
  labelKey: 'checkout_billing_private' | 'checkout_billing_company'
}[] = [
  { value: 'PRIVATE', labelKey: 'checkout_billing_private' },
  { value: 'COMPANY', labelKey: 'checkout_billing_company' },
]

export type { BillingFormValues } from '@/lib/schemas/forms/billing.form.schema'

function BillingStep() {
  const t = useTranslation()
  const { control } = useFormContext<BillingFormValues>()
  const billingType = useWatch({ control, name: 'billingType' })
  const { lang } = useParams<{ lang: string }>()
  const countryOptions = React.useMemo(() => getCountryOptions(lang), [lang])
  const isCompany = billingType === 'COMPANY'

  return (
    <div className="space-y-5">
      {/* Billing type toggle */}
      <RadioFormField<BillingFormValues, (typeof billingTypeOptions)[number]>
        name="billingType"
        label={t.checkout_billing_type_label}
        options={billingTypeOptions}
        getValue={o => o.value}
        getLabel={o => t[o.labelKey]}
      />

      {/* Company-only fields */}
      {isCompany && (
        <div className="space-y-3">
          <InputFormField<BillingFormValues>
            name="companyName"
            label={t.checkout_billing_company_name}
            required
            autoComplete="organization"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InputFormField<BillingFormValues>
              name="vatNumber"
              label={t.checkout_billing_vat_number}
              description={t.checkout_billing_vat_number_hint}
              required
              maxLength={11}
              normalize={v => v.replace(/\D/g, '').slice(0, 11)}
              inputMode="numeric"
            />
            <InputFormField<BillingFormValues>
              name="sdiCode"
              label={t.checkout_billing_sdi_code}
              description={t.checkout_billing_sdi_or_pec_hint}
              maxLength={7}
              normalize={v => v.toUpperCase().slice(0, 7)}
            />
          </div>

          <InputFormField<BillingFormValues>
            name="pec"
            label={t.checkout_billing_pec}
            description={t.checkout_billing_pec_hint}
            type="email"
            autoComplete="email"
          />
        </div>
      )}

      {/* Common personal fields */}
      <div className={cn('space-y-3', isCompany && 'border-t pt-5')}>
        {isCompany && (
          <p className="text-xs font-medium text-muted-foreground">
            {t.checkout_billing_legal_representative}
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InputFormField<BillingFormValues>
            name="firstName"
            label={t.checkout_billing_first_name}
            required
            autoComplete="given-name"
          />
          <InputFormField<BillingFormValues>
            name="lastName"
            label={t.checkout_billing_last_name}
            required
            autoComplete="family-name"
          />
        </div>

        <PhoneFormField<BillingFormValues> name="phone" label={t.checkout_billing_phone} required />

        <InputFormField<BillingFormValues>
          name="fiscalCode"
          label={t.checkout_billing_fiscal_code}
          description={t.checkout_billing_fiscal_code_hint}
          required
          maxLength={16}
          normalize={v =>
            v
              .toUpperCase()
              .replace(/[^A-Z0-9]/g, '')
              .slice(0, 16)
          }
        />
      </div>

      {/* Address fields */}
      <div className="space-y-3 border-t pt-5">
        <p className="text-xs font-medium text-muted-foreground">{t.checkout_billing_address_section}</p>

        <InputFormField<BillingFormValues>
          name="streetAddress"
          label={t.checkout_billing_street_address}
          required
          autoComplete="street-address"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InputFormField<BillingFormValues>
            name="city"
            label={t.checkout_billing_city}
            required
            autoComplete="address-level2"
          />
          <InputFormField<BillingFormValues>
            name="zipCode"
            label={t.checkout_billing_zip_code}
            required
            maxLength={5}
            normalize={v => v.replace(/\D/g, '').slice(0, 5)}
            inputMode="numeric"
            autoComplete="postal-code"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InputFormField<BillingFormValues>
            name="province"
            label={t.checkout_billing_province}
            required
            maxLength={2}
            normalize={v =>
              v
                .toUpperCase()
                .replace(/[^A-Z]/g, '')
                .slice(0, 2)
            }
            autoComplete="address-level1"
          />
          <ComboboxFormField<BillingFormValues, CountryOption>
            name="country"
            label={t.checkout_billing_country}
            options={countryOptions}
            getValue={o => o.value}
            getLabel={o => o.label}
            renderOption={o => <CountryFlag country={o.value} />}
            required
          />
        </div>
      </div>
    </div>
  )
}

export { BillingStep }
