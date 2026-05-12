'use client'

import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import useLocaleStore from '@/core/store/locale.store'

type Status = 'verifying' | 'success' | 'error'

export default function VerifyMagicLink() {
  const t = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = useLocaleStore(state => state.lang)

  const token = searchParams.get('token')
  const callbackUrl = searchParams.get('callbackUrl') ?? `/${lang}`

  const [status, setStatus] = useState<Status>(() => (token ? 'verifying' : 'error'))

  useEffect(() => {
    if (!token) return

    let cancelled = false
    signIn('magic-link', { token, redirect: false, callbackUrl })
      .then(res => {
        if (cancelled) return
        if (res?.error || !res?.ok) {
          setStatus('error')
          return
        }
        setStatus('success')
        router.replace(callbackUrl)
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [token, callbackUrl, router])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-12 text-center">
      {status === 'verifying' && (
        <>
          <h1 className="text-2xl font-semibold">{t.auth_verify_in_progress_title}</h1>
          <p className="mt-2 text-muted-foreground">{t.auth_verify_in_progress_subtitle}</p>
        </>
      )}

      {status === 'success' && (
        <>
          <h1 className="text-2xl font-semibold">{t.auth_verify_success_title}</h1>
          <p className="mt-2 text-muted-foreground">{t.auth_verify_success_subtitle}</p>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 className="text-2xl font-semibold">{t.auth_verify_error_title}</h1>
          <p className="mt-2 text-muted-foreground">{t.auth_verify_error_subtitle}</p>
          <Button className="mt-6" onClick={() => router.replace(`/${lang}`)}>
            {t.auth_verify_back_home}
          </Button>
        </>
      )}
    </div>
  )
}
