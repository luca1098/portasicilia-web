'use client'

import * as React from 'react'
import { type FieldValues, type Path } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { InputWrapper } from '@/components/form/input-wrapper'
import { FormField } from './form-field'
import { Nullish } from '@/core/utils/types'

interface InputFormFieldProps<TFieldValues extends FieldValues>
  extends Omit<React.ComponentProps<'input'>, 'name' | 'onChange' | 'value'> {
  name: Path<TFieldValues>
  label: string
  description?: string
  normalize?: (value: string) => string
  onChange?: (value: Nullish<string>) => void
}

function InputFormField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  required,
  maxLength,
  className,
  ...inputProps
}: InputFormFieldProps<TFieldValues>) {
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
          hasValue={!!field.value}
          required={required}
          maxLength={maxLength}
          currentLength={typeof field.value === 'string' ? field.value.length : 0}
        >
          <Input
            id={name}
            aria-invalid={!!error}
            {...inputProps}
            {...field}
            value={field.value ?? ''}
            onBlur={e => {
              field.onBlur()
              inputProps.onBlur && inputProps.onBlur(e)
            }}
            onChange={event => {
              const { value } = event.target || {}
              const normalizedValue = inputProps.normalize ? inputProps.normalize(value) : (value ?? '')
              field.onChange(normalizedValue)
              inputProps.onChange && inputProps.onChange(normalizedValue)
            }}
          />
        </InputWrapper>
      )}
    />
  )
}

export { InputFormField, type InputFormFieldProps }
