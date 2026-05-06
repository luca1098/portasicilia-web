'use client'

import dynamic from 'next/dynamic'
import { type FieldValues, type Path } from 'react-hook-form'
import { cn } from '@/lib/utils/shadcn.utils'
import { FormField } from './form-field'

const RichTextEditor = dynamic(() => import('@/components/ui/rich-text-editor').then(m => m.RichTextEditor), {
  ssr: false,
  loading: () => <div className="h-[200px] animate-pulse rounded-lg border border-input bg-muted" />,
})

type RichTextFormFieldProps<T extends FieldValues> = {
  name: Path<T>
  label: string
  placeholder?: string
  required?: boolean
  description?: string
  className?: string
}

function RichTextFormField<T extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  description,
  className,
}: RichTextFormFieldProps<T>) {
  return (
    <FormField
      name={name}
      renderField={({ field, fieldState: { error } }) => (
        <div className={cn('grid gap-1', className)}>
          <label className="text-sm font-medium leading-none" htmlFor={name}>
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </label>
          <RichTextEditor content={field.value ?? ''} onChange={field.onChange} placeholder={placeholder} />
          {(error || description) && (
            <div>
              {error ? (
                <p className="text-destructive text-sm">{error.message}</p>
              ) : description ? (
                <p className="text-muted-foreground text-sm">{description}</p>
              ) : null}
            </div>
          )}
        </div>
      )}
    />
  )
}

export { RichTextFormField, type RichTextFormFieldProps }
