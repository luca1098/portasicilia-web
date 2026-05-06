'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/shadcn.utils'
import { UploadCloudIcon, XIcon } from '@/lib/constants/icons'

type FileUploaderLabels = {
  dragDrop: string
  browse: string
  maxSize: string
  invalidType: string
  fileTooLarge: string
  remove: string
}

type FileUploaderProps = {
  value: File | string | null
  onChange: (file: File | null) => void
  accept?: string
  maxSizeMB?: number
  disabled?: boolean
  error?: boolean
  className?: string
  labels: FileUploaderLabels
}

function FileUploader({
  value,
  onChange,
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 5,
  disabled,
  error,
  className,
  labels,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  const acceptedTypes = accept.split(',').map(t => t.trim())

  const previewUrl = value instanceof File ? objectUrl : typeof value === 'string' ? value : null

  const validateAndSet = useCallback(
    (file: File) => {
      if (!acceptedTypes.includes(file.type)) {
        setValidationError(labels.invalidType)
        onChange(null)
        return
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setValidationError(labels.fileTooLarge)
        onChange(null)
        return
      }
      setValidationError(null)
      const url = URL.createObjectURL(file)
      setObjectUrl(prev => {
        if (prev) URL.revokeObjectURL(prev)
        return url
      })
      onChange(file)
    },
    [acceptedTypes, labels.invalidType, labels.fileTooLarge, maxSizeMB, onChange]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) setIsDragging(true)
    },
    [disabled]
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      const file = e.dataTransfer.files[0]
      if (file) validateAndSet(file)
    },
    [disabled, validateAndSet]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) validateAndSet(file)
      if (inputRef.current) inputRef.current.value = ''
    },
    [validateAndSet]
  )

  const handleRemove = useCallback(() => {
    setObjectUrl(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setValidationError(null)
    onChange(null)
  }, [onChange])

  return (
    <div className={cn('relative', className)}>
      {previewUrl ? (
        <div className="relative">
          <Image
            src={previewUrl}
            alt="Cover preview"
            width={600}
            height={160}
            className="h-40 w-full rounded-lg object-cover"
            unoptimized
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-foreground shadow-sm transition-colors hover:bg-background"
            aria-label={labels.remove}
          >
            <XIcon className="size-4" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (!disabled) inputRef.current?.click()
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : error || validationError
                ? 'border-destructive bg-destructive/5'
                : 'border-border bg-muted hover:border-primary/50',
            disabled && 'pointer-events-none opacity-50'
          )}
        >
          <UploadCloudIcon className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {labels.dragDrop} <span className="font-medium text-primary underline">{labels.browse}</span>
          </p>
          <p className="text-xs text-muted-foreground">{labels.maxSize}</p>
        </div>
      )}

      {validationError && <p className="mt-1 text-sm text-destructive">{validationError}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  )
}

export { FileUploader, type FileUploaderProps, type FileUploaderLabels }
