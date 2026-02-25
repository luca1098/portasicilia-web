'use client'

import { useState } from 'react'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { UserIcon } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'
import LoginStep from '@/components/checkout/login-step'
import { cn } from '@/lib/utils/shadcn.utils'

type CheckoutStepsProps = {
  depositAmount: number | null
}

export default function CheckoutSteps({ depositAmount }: CheckoutStepsProps) {
  const t = useTranslation()
  const { data: session } = useSession()

  const [activeStep, setActiveStep] = useState(session ? 2 : 1)

  const isStep1Complete = !!session
  const effectiveStep = isStep1Complete && activeStep === 1 ? 2 : activeStep
  const isStep2Active = effectiveStep === 2 && isStep1Complete

  return (
    <div className="space-y-4" role="list" aria-label={t.checkout_steps}>
      {/* Step 1: Login */}
      <section
        className="rounded-xl border bg-background"
        role="listitem"
        aria-current={effectiveStep === 1 ? 'step' : undefined}
      >
        {isStep1Complete ? (
          <div className="flex items-center gap-4 p-5">
            {session?.user?.avatar ? (
              <Image
                src={session.user.avatar}
                alt=""
                width={44}
                height={44}
                className="size-11 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-11 items-center justify-center rounded-full bg-muted">
                <UserIcon className="size-5 text-muted-foreground" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold">
                {[session?.user?.firstName, session?.user?.lastName].filter(Boolean).join(' ') ||
                  session?.user?.email}
              </p>
              {session?.user?.firstName && (
                <p className="truncate text-sm text-muted-foreground">{session?.user?.email}</p>
              )}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => signOut({ callbackUrl: window.location.href })}
            >
              {t.checkout_change_account}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full text-sm font-semibold',
                    effectiveStep === 1
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                  aria-hidden="true"
                >
                  1
                </span>
                <h2 className="text-base font-semibold">{t.checkout_step_login}</h2>
              </div>
              {effectiveStep !== 1 && (
                <Button size="sm" onClick={() => setActiveStep(1)}>
                  {t.checkout_continue}
                </Button>
              )}
            </div>
            {effectiveStep === 1 && (
              <div className="border-t px-5 pb-5 pt-4">
                <LoginStep />
              </div>
            )}
          </>
        )}
      </section>

      {/* Step 2: Payment method */}
      <section
        className={cn(
          'rounded-xl border bg-background transition-opacity',
          !isStep1Complete && 'pointer-events-none opacity-50'
        )}
        role="listitem"
        aria-current={effectiveStep === 2 ? 'step' : undefined}
      >
        <div className="flex items-center gap-3 p-5">
          <span
            className={cn(
              'flex size-7 items-center justify-center rounded-full text-sm font-semibold',
              isStep2Active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
            aria-hidden="true"
          >
            2
          </span>
          <h2 className="text-base font-semibold">{t.checkout_step_payment}</h2>
        </div>
        {isStep2Active && (
          <div className="border-t px-5 pb-5 pt-4">
            <p className="text-sm text-muted-foreground">{t.checkout_payment_coming_soon}</p>
          </div>
        )}
      </section>

      {isStep2Active && (
        <div className="mt-2">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t.checkout_policy_text}{' '}
            <button type="button" className="underline underline-offset-2 hover:text-foreground">
              {t.checkout_policy_learn_more}
            </button>
          </p>

          {depositAmount !== null && depositAmount > 0 && (
            <Button className="mt-4 h-12 w-full rounded-xl text-base font-semibold" size="lg">
              {interpolate(t.checkout_pay_with_deposit, {
                amount: Math.round(depositAmount),
              })}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
