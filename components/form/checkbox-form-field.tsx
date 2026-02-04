'use client'

import * as React from 'react'
import { type FieldValues, type Path } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { InputWrapper } from '@/components/form/input-wrapper'
import { FormField } from './form-field'

interface CheckboxFormFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  description?: string
  className?: string
  disabled?: boolean
  required?: boolean
}

function CheckboxFormField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  className,
  disabled,
  required,
}: CheckboxFormFieldProps<TFieldValues>) {
  return (
    <FormField
      name={name}
      renderField={({ field, fieldState: { error } }) => (
        <InputWrapper label="" htmlFor={name} description={description} error={error} className={className}>
          <div className="flex items-center gap-2">
            <Checkbox
              id={name}
              checked={field.value || false}
              onCheckedChange={checked => field.onChange(checked === true)}
              disabled={disabled}
              required={required}
              aria-invalid={!!error}
            />
            <Label htmlFor={name} className="cursor-pointer">
              {label}
              {required && <span className="text-destructive ml-0.5">*</span>}
            </Label>
          </div>
        </InputWrapper>
      )}
    />
  )
}

export { CheckboxFormField, type CheckboxFormFieldProps }
