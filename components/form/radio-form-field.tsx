'use client'

import { type FieldValues, type Path } from 'react-hook-form'

import { cn } from '@/lib/utils/shadcn.utils'
import { FormField } from './form-field'

interface RadioFormFieldProps<TFieldValues extends FieldValues, TOption> {
  name: Path<TFieldValues>
  label?: string
  description?: string
  options: TOption[]
  getValue: (option: TOption) => string
  getLabel: (option: TOption) => string
  getKey?: (option: TOption) => string
  className?: string
  disabled?: boolean
  required?: boolean
}

function RadioFormField<TFieldValues extends FieldValues, TOption>({
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
}: RadioFormFieldProps<TFieldValues, TOption>) {
  return (
    <FormField
      name={name}
      renderField={({ field, fieldState: { error } }) => (
        <div className={cn('grid gap-1', className)}>
          {label && (
            <label className="text-xs font-medium text-muted-foreground">
              {label}
              {required && <span className="ml-0.5 text-destructive">*</span>}
            </label>
          )}
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={label} aria-invalid={!!error}>
            {options.map(option => {
              const value = getValue(option)
              const isSelected = field.value === value
              return (
                <label
                  key={getKey ? getKey(option) : value}
                  className={cn(
                    'relative cursor-pointer select-none rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input bg-transparent text-muted-foreground hover:border-muted-foreground/50',
                    disabled && 'pointer-events-none opacity-50',
                    error && !isSelected && 'border-destructive/50'
                  )}
                >
                  <input
                    type="radio"
                    name={name}
                    value={value}
                    checked={isSelected}
                    onChange={() => field.onChange(value)}
                    disabled={disabled}
                    className="sr-only"
                  />
                  {getLabel(option)}
                </label>
              )
            })}
          </div>
          {error && <p className="text-sm text-destructive">{error.message}</p>}
          {!error && description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
    />
  )
}

export { RadioFormField, type RadioFormFieldProps }
