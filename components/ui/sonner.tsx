'use client'

import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { CheckCheckIcon, AlertTriangleIcon, BanIcon, InfoIcon } from '@/lib/constants/icons'

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="ps-toaster"
      icons={{
        success: <CheckCheckIcon className="size-3.5" strokeWidth={3} />,
        error: <BanIcon className="size-3.5" strokeWidth={3} />,
        warning: <AlertTriangleIcon className="size-3.5" strokeWidth={3} />,
        info: <InfoIcon className="size-3.5" strokeWidth={3} />,
      }}
      closeButton
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: 'ps-toast',
          success: 'ps-toast-success',
          error: 'ps-toast-error',
          warning: 'ps-toast-warning',
          info: 'ps-toast-info',
          title: 'ps-toast-title',
          description: 'ps-toast-description',
          icon: 'ps-toast-icon',
          closeButton: 'ps-toast-close',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
