'use client'

import * as React from 'react'
import { type FieldValues, type Path } from 'react-hook-form'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { InputWrapper } from '@/components/form/input-wrapper'
import { FormField } from './form-field'

interface PasswordFormFieldProps<TFieldValues extends FieldValues>
  extends Omit<React.ComponentProps<'input'>, 'name' | 'onChange' | 'value' | 'type'> {
  name: Path<TFieldValues>
  label: string
  description?: string
}

function PasswordFormField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  required,

  className,
  ...inputProps
}: PasswordFormFieldProps<TFieldValues>) {
  const [visible, setVisible] = React.useState(false)

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
          <Input
            id={name}
            type={visible ? 'text' : 'password'}
            aria-invalid={!!error}
            className="pr-10"
            {...inputProps}
            {...field}
            value={field.value ?? ''}
            onBlur={e => {
              field.onBlur()
              inputProps.onBlur && inputProps.onBlur(e)
            }}
            onChange={event => {
              const { value } = event.target || {}
              field.onChange(value ?? '')
            }}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </button>
        </InputWrapper>
      )}
    />
  )
}

export { PasswordFormField, type PasswordFormFieldProps }
