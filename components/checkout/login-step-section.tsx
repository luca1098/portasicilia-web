'use client'

import { useState } from 'react'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'

import LoginPopup from '@/components/auth/login-popup'
import { Button } from '@/components/ui/button'
import { UserIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { cn } from '@/lib/utils/shadcn.utils'

type LoginStepSectionProps = {
  isActive: boolean
}

export default function LoginStepSection({ isActive }: LoginStepSectionProps) {
  const t = useTranslation()
  const { data: session } = useSession()

  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const isComplete = !!session

  return (
    <section
      className="rounded-xl border bg-background"
      role="listitem"
      aria-current={isActive ? 'step' : undefined}
    >
      {isComplete ? (
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
        <div className="flex items-center justify-between gap-3 p-5">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'flex size-7 items-center justify-center rounded-full text-sm font-semibold',
                isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}
              aria-hidden="true"
            >
              1
            </span>
            <h2 className="text-base font-semibold">{t.checkout_step_login}</h2>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setIsPopupOpen(true)}>
            {t.login}
          </Button>
        </div>
      )}

      {isPopupOpen ? <LoginPopup onClose={() => setIsPopupOpen(false)} /> : null}
    </section>
  )
}
