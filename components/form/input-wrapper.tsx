'use client'

import * as React from 'react'
import type { FieldError } from 'react-hook-form'

import { cn } from '@/lib/utils/shadcn.utils'

interface InputWrapperProps {
  label: string
  htmlFor?: string
  description?: string
  error?: FieldError
  children: React.ReactNode
  className?: string
  hasValue?: boolean
  required?: boolean
}

function InputWrapper({
  label,
  htmlFor,
  description,
  error,
  children,
  className,
  hasValue,
  required,
}: InputWrapperProps) {
  return (
    <div className={cn('grid gap-1', className)}>
      <div className="group/field relative" data-has-value={hasValue ? '' : undefined}>
        {children}
        {label && (
          <label
            htmlFor={htmlFor}
            className={cn(
              'absolute left-3 pointer-events-none select-none transition-all duration-200',
              'text-muted-foreground font-normal',
              'top-4 text-sm',
              'group-focus-within/field:top-1.5 group-focus-within/field:text-xs',
              'group-data-[has-value]/field:top-1.5 group-data-[has-value]/field:text-xs'
            )}
          >
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </label>
        )}
      </div>
      {error ? (
        <p className="text-destructive text-sm">{error.message}</p>
      ) : description ? (
        <p className="text-muted-foreground text-sm">{description}</p>
      ) : null}
    </div>
  )
}

export { InputWrapper, type InputWrapperProps }
