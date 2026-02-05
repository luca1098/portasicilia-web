'use client'

import * as React from 'react'
import { type FieldValues, type Path } from 'react-hook-form'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InputWrapper } from '@/components/form/input-wrapper'
import { FormField } from './form-field'

interface SelectFormFieldProps<TFieldValues extends FieldValues, TOption> {
  name: Path<TFieldValues>
  label: string
  description?: string
  options: TOption[]
  getValue: (option: TOption) => string
  getLabel: (option: TOption) => string
  getKey?: (option: TOption) => string
  className?: string
  disabled?: boolean
  required?: boolean
}

function SelectFormField<TFieldValues extends FieldValues, TOption>({
  name,
  label,
  description,
  options,
  getValue,
  getLabel,
  getKey,
  className,
  disabled,
  required,
}: SelectFormFieldProps<TFieldValues, TOption>) {
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
          <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
            <SelectTrigger id={name} aria-invalid={!!error}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => {
                const value = getValue(option)
                return (
                  <SelectItem key={getKey ? getKey(option) : value} value={value}>
                    {getLabel(option)}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </InputWrapper>
      )}
    />
  )
}

export { SelectFormField, type SelectFormFieldProps }
