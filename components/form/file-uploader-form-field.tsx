'use client'

import { type FieldValues, type Path } from 'react-hook-form'
import { FileUploader } from '@/components/ui/file-uploader'
import { InputWrapper } from '@/components/form/input-wrapper'
import { FormField } from './form-field'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'

interface FileUploaderFormFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  accept?: string
  maxSizeMB?: number
  className?: string
  disabled?: boolean
  required?: boolean
}

function FileUploaderFormField<TFieldValues extends FieldValues>({
  name,
  label,
  accept,
  maxSizeMB = 1,
  className,
  disabled,
  required,
}: FileUploaderFormFieldProps<TFieldValues>) {
  const t = useTranslation()

  const acceptedTypes = accept ?? 'image/jpeg,image/png,image/webp'
  const formats = acceptedTypes
    .split(',')
    .map(type => type.trim().split('/').pop()?.toUpperCase())
    .filter(Boolean)
    .join(', ')
  const description = interpolate(t.file_upload_description, { formats, size: maxSizeMB })

  const labels = {
    dragDrop: t.file_upload_drag_drop,
    browse: t.file_upload_browse,
    maxSize: interpolate(t.file_upload_max_size, { size: maxSizeMB }),
    invalidType: t.file_upload_invalid_type,
    fileTooLarge: interpolate(t.file_upload_too_large, { size: maxSizeMB }),
    remove: t.file_upload_remove,
  }

  return (
    <FormField
      name={name}
      renderField={({ field, fieldState: { error } }) => (
        <InputWrapper label="" htmlFor={name} description={description} error={error} className={className}>
          <div>
            <label htmlFor={name} className="text-sm font-medium">
              {label}
              {required && <span className="text-destructive ml-0.5">*</span>}
            </label>
          </div>
          <FileUploader
            value={field.value}
            onChange={field.onChange}
            accept={accept}
            maxSizeMB={maxSizeMB}
            disabled={disabled}
            error={!!error}
            labels={labels}
          />
        </InputWrapper>
      )}
    />
  )
}

export { FileUploaderFormField, type FileUploaderFormFieldProps }
