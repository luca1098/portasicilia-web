'use client'

import { type FieldValues, type Path } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { InputWrapper } from '@/components/form/input-wrapper'
import { FormField } from './form-field'

interface TimeFormFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  description?: string
  className?: string
  disabled?: boolean
  required?: boolean
}

function TimeFormField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  className,
  disabled,
  required,
}: TimeFormFieldProps<TFieldValues>) {
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
          hasValue={true}
          required={required}
        >
          <Input
            id={name}
            type="time"
            aria-invalid={!!error}
            disabled={disabled}
            {...field}
            value={field.value ?? ''}
          />
        </InputWrapper>
      )}
    />
  )
}

export { TimeFormField, type TimeFormFieldProps }
