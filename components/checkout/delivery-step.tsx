'use client'

import { InputFormField } from '@/components/form/input-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { useTranslation } from '@/lib/context/translation.context'
import type { DeliveryFormValues } from '@/lib/schemas/forms/delivery.form.schema'

export function DeliveryStep() {
  const t = useTranslation()

  return (
    <div className="space-y-3">
      <InputFormField<DeliveryFormValues>
        name="region"
        label={t.delivery_region}
        required
        autoComplete="address-level1"
      />

      <InputFormField<DeliveryFormValues>
        name="street"
        label={t.delivery_street}
        required
        autoComplete="street-address"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InputFormField<DeliveryFormValues>
          name="zipCode"
          label={t.delivery_zip}
          required
          maxLength={5}
          normalize={v => v.replace(/\D/g, '').slice(0, 5)}
          inputMode="numeric"
          autoComplete="postal-code"
        />
        <InputFormField<DeliveryFormValues>
          name="city"
          label={t.delivery_city}
          required
          autoComplete="address-level2"
        />
      </div>

      <InputFormField<DeliveryFormValues>
        name="province"
        label={t.delivery_province}
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

      <TextareaFormField<DeliveryFormValues> name="notes" label={t.delivery_notes} maxLength={500} rows={3} />
    </div>
  )
}
