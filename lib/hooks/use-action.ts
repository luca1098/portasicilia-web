import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/context/translation.context'
import type { ActionResult } from '@/lib/actions/action.types'

type UseActionOptions<T> = {
  onSuccess?: (data?: T) => void
  onError?: (error: string) => void
  successMessage?: string
  errorMessage?: string
}

export function useAction<T = void>(options: UseActionOptions<T> = {}) {
  const [loading, setLoading] = useState(false)
  const t = useTranslation()

  const execute = useCallback(
    async (action: () => Promise<ActionResult<T>>) => {
      setLoading(true)
      try {
        const result = await action()
        if (result.success) {
          if (options.successMessage) toast.success(options.successMessage)
          options.onSuccess?.(result.data)
        } else {
          const msg = result.error ?? options.errorMessage ?? t.admin_common_error
          toast.error(msg)
          options.onError?.(msg)
        }
        return result
      } catch {
        const msg = options.errorMessage ?? t.admin_common_error
        toast.error(msg)
        options.onError?.(msg)
        return { success: false, error: msg } as ActionResult<T>
      } finally {
        setLoading(false)
      }
    },
    [options, t.admin_common_error]
  )

  return { loading, execute }
}
