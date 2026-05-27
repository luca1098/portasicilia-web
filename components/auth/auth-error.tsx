'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { AlertTriangleIcon } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import useLocaleStore from '@/core/store/locale.store'

export default function AuthError() {
  const t = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = useLocaleStore(state => state.lang)

  const error = searchParams.get('error')
  const isAccountLinked = error === 'OAuthAccountNotLinked'

  const title = isAccountLinked ? t.auth_error_account_linked_title : t.auth_error_title
  const subtitle = isAccountLinked ? t.auth_error_account_linked_subtitle : t.auth_error_subtitle

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangleIcon className="size-8 text-destructive" />
      </div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-muted-foreground">{subtitle}</p>
      <div className="mt-8 flex gap-3">
        <Button variant="outline" onClick={() => router.replace(`/${lang}`)}>
          {t.auth_verify_back_home}
        </Button>
        <Button onClick={() => router.replace(`/${lang}`)}>{t.auth_error_try_again}</Button>
      </div>
    </div>
  )
}
