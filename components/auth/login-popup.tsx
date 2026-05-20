'use client'

import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { z } from 'zod'

import { X } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'
import { InputFormField } from '@/components/form/input-form-field'
import { useAction } from '@/lib/hooks/use-action'
import { useTranslation } from '@/lib/context/translation.context'
import useLocaleStore from '@/core/store/locale.store'

interface LoginPopupProps {
  onClose: () => void
}

type EmailFormValues = {
  email: string
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

export default function LoginPopup({ onClose }: LoginPopupProps) {
  const pathname = usePathname()
  const t = useTranslation()
  const lang = useLocaleStore(state => state.lang)

  const [sentTo, setSentTo] = useState<string | null>(null)

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().min(1, t.login_email_required).email(t.login_email_invalid),
      }),
    [t]
  )

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const { loading, execute } = useAction<{ email: string }>({
    onSuccess: data => {
      if (data) setSentTo(data.email)
    },
  })

  const buildCallbackUrl = () => `${pathname}${window.location.search}`

  const onSubmit = (values: EmailFormValues) => {
    void execute(async () => {
      const res = await fetch('/api/magic-link/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          lang: lang.toUpperCase(),
          callbackUrl: buildCallbackUrl(),
        }),
      })
      if (!res.ok) {
        return { success: false, error: t.admin_common_error }
      }
      return { success: true, data: { email: values.email } }
    })
  }

  return createPortal(
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4">
        <div className="relative rounded-2xl bg-background p-6 shadow-xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          {sentTo ? (
            <div className="py-2">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold">{t.login_magic_link_sent_title}</h2>
                <p className="mt-2 text-muted-foreground">{t.login_magic_link_sent_subtitle}</p>
                <p className="mt-3 break-all text-sm font-medium text-foreground">{sentTo}</p>
              </div>
              <p className="text-center text-xs text-muted-foreground">{t.login_magic_link_sent_hint}</p>
              <Button variant="outline" className="mt-6 w-full" onClick={() => setSentTo(null)}>
                {t.login_magic_link_use_another_email}
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold">{t.login_popup_title}</h2>
                <p className="mt-2 text-muted-foreground">{t.login_popup_subtitle}</p>
              </div>

              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  <InputFormField<EmailFormValues>
                    name="email"
                    label={t.login_email_label}
                    type="email"
                    required
                  />
                  <Button type="submit" size="lg" className="w-full justify-center" disabled={loading}>
                    {loading ? t.login_magic_link_sending : t.login_continue_with_email}
                  </Button>
                </form>
              </FormProvider>

              <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                {t.login_or}
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-center gap-3"
                  onClick={() => signIn('google', { callbackUrl: buildCallbackUrl() })}
                >
                  <GoogleIcon className="size-5" />
                  {t.login_with_google}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-center gap-3"
                  onClick={() => signIn('apple', { callbackUrl: buildCallbackUrl() })}
                >
                  <AppleIcon className="size-5" />
                  {t.login_with_apple}
                </Button>
              </div>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                {t.login_terms_notice}{' '}
                <a href="#" className="underline hover:text-foreground">
                  {t.footer_terms}
                </a>{' '}
                {t.login_terms_and}{' '}
                <a href="#" className="underline hover:text-foreground">
                  {t.footer_privacy_policy}
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  )
}
