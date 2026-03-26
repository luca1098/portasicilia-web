'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { UserIcon, LayoutDashboardIcon, LogOutIcon } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import LoginPopup from '@/components/auth/login-popup'
import { cn } from '@/lib/utils/shadcn.utils'

interface AccountMenuProps {
  isTransparent?: boolean
}

export default function AccountMenu({ isTransparent }: AccountMenuProps) {
  const [open, setOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const { lang } = useParams()
  const t = useTranslation()

  const user = session?.user
  const initials = user
    ? `${user.firstName?.charAt(0) ?? ''}${user.lastName?.charAt(0) ?? ''}`.toUpperCase()
    : ''

  const handleLoginClick = () => {
    setOpen(false)
    setLoginOpen(true)
  }

  const handleLogout = () => {
    setOpen(false)
    signOut()
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} className="relative">
      {user ? (
        <button
          className={cn(
            'flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-200',
            open ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
          )}
          aria-label="Account"
          onClick={() => setOpen(prev => !prev)}
        >
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium">{initials}</span>
          )}
        </button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Account"
          onClick={() => setOpen(prev => !prev)}
          className={cn(
            isTransparent &&
              'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] hover:bg-white/10 hover:text-white'
          )}
        >
          <UserIcon />
        </Button>
      )}

      <div
        className={cn(
          'absolute right-0 top-full z-50 pt-2 transition-all duration-200',
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        )}
      >
        <div className="w-48 overflow-hidden rounded-xl border border-border/60 bg-background/95 p-1.5 shadow-lg backdrop-blur-xl">
          {user ? (
            <>
              <Link
                href={`/${lang}/dashboard`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                <LayoutDashboardIcon className="h-4 w-4 text-muted-foreground" />
                {t.dashboard}
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                <LogOutIcon className="h-4 w-4 text-muted-foreground" />
                {t.logout}
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              {t.login_or_sign_in}
            </button>
          )}
        </div>
      </div>

      {loginOpen ? <LoginPopup onClose={() => setLoginOpen(false)} /> : null}
    </div>
  )
}
