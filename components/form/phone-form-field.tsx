'use client'

import { type FieldValues, type Path } from 'react-hook-form'

import { PhoneInput } from '@/components/form/phone-input'
import { FormField } from './form-field'
import { cn } from '@/lib/utils/shadcn.utils'

interface PhoneFormFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  description?: string
  className?: string
  required?: boolean
}

function PhoneFormField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  className,
  required,
}: PhoneFormFieldProps<TFieldValues>) {
  return (
    <FormField
      name={name}
      renderField={({ field, fieldState: { error } }) => (
        <div className={cn('grid gap-1', className)}>
          <div className="flex">
            {/* Country selector sits outside the labeled area */}
            <PhoneInput
              id={name}
              defaultCountry="IT"
              value={field.value ?? ''}
              onChange={field.onChange}
              aria-invalid={!!error}
              label={label}
              required={required}
            />
          </div>
          {(error || description) && (
            <div>
              {error ? (
                <p className="text-sm text-destructive">{error.message}</p>
              ) : description ? (
                <p className="text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
          )}
        </div>
      )}
    />
  )
}

export { PhoneFormField, type PhoneFormFieldProps }
