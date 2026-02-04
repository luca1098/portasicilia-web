'use client'

import * as React from 'react'
import { type FieldValues, type Path } from 'react-hook-form'

import { Textarea } from '@/components/ui/textarea'
import { InputWrapper } from '@/components/form/input-wrapper'
import { FormField } from './form-field'

interface TextareaFormFieldProps<TFieldValues extends FieldValues>
  extends Omit<React.ComponentProps<'textarea'>, 'name'> {
  name: Path<TFieldValues>
  label: string
  description?: string
}

function TextareaFormField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  required,
  className,
  ...textareaProps
}: TextareaFormFieldProps<TFieldValues>) {
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
        >
          <Textarea
            id={name}
            aria-invalid={!!error}
            {...textareaProps}
            {...field}
            value={field.value ?? ''}
          />
        </InputWrapper>
      )}
    />
  )
}

export { TextareaFormField, type TextareaFormFieldProps }
