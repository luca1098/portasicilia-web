'use client'

import * as React from 'react'
import { type FieldValues, type Path } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { InputWrapper } from '@/components/form/input-wrapper'
import { FormField } from './form-field'
interface CurrencyFormFieldProps<TFieldValues extends FieldValues>
  extends Omit<React.ComponentProps<'input'>, 'name' | 'onChange' | 'value' | 'type'> {
  name: Path<TFieldValues>
  label: string
  description?: string
  suffix?: string
}

function CurrencyFormField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  required,
  className,
  suffix = '€',
  ...inputProps
}: CurrencyFormFieldProps<TFieldValues>) {
  return (
    <FormField
      name={name}
      renderField={({ field, fieldState: { error } }) => (
        <InputWrapper
          label={label}
          htmlFor={name}
          description={description}
          error={error}
          className={className}
          hasValue={field.value != null && field.value !== ''}
          required={required}
        >
          <div className="relative">
            <Input
              id={name}
              type="number"
              step="0.01"
              min="0"
              aria-invalid={!!error}
              {...inputProps}
              {...field}
              value={field.value ?? ''}
              className="pr-9"
              onBlur={e => {
                field.onBlur()
                inputProps.onBlur && inputProps.onBlur(e)
              }}
              onChange={event => {
                const raw = event.target.value
                field.onChange(raw === '' ? null : Number(raw))
              }}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {suffix}
            </span>
          </div>
        </InputWrapper>
      )}
    />
  )
}

export { CurrencyFormField, type CurrencyFormFieldProps }
