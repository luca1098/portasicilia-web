'use client'
import { type FieldValues, type Path } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { InputWrapper } from '@/components/form/input-wrapper'
import { FormField } from './form-field'
import { isNil } from 'lodash'

interface NumberFormFieldProps<TFieldValues extends FieldValues>
  extends Omit<React.ComponentProps<'input'>, 'name' | 'onChange' | 'value' | 'type'> {
  name: Path<TFieldValues>
  label: string
  description?: string
}

function NumberFormField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  required,
  className,
  ...inputProps
}: NumberFormFieldProps<TFieldValues>) {
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
          hasValue={!isNil(field.value)}
          required={required}
        >
          <Input
            id={name}
            type="number"
            aria-invalid={!!error}
            {...inputProps}
            {...field}
            value={field.value ?? 0}
            onBlur={e => {
              field.onBlur()
              inputProps.onBlur && inputProps.onBlur(e)
            }}
            onChange={event => {
              const raw = event.target.value
              field.onChange(raw === '' ? null : Number(raw))
            }}
          />
        </InputWrapper>
      )}
    />
  )
}

export { NumberFormField, type NumberFormFieldProps }
