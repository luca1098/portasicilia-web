'use client'

import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { SparklesIcon, AlertCircleIcon } from '@/lib/constants/icons'

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <SparklesIcon className="size-5" />,
        error: <AlertCircleIcon className="size-5" />,
      }}
      closeButton
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'ps-toast flex items-center gap-3 w-full rounded-xl px-4 py-3.5 shadow-lg text-sm font-medium',
          success: 'ps-toast-success',
          error: 'ps-toast-error',
          title: 'ps-toast-title',
          icon: 'ps-toast-icon shrink-0',
          closeButton: 'ps-toast-close',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
