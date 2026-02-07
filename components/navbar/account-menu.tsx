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

export default function AccountMenu() {
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
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border"
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
        <Button variant="outline" size="icon" aria-label="Account" onClick={() => setOpen(prev => !prev)}>
          <UserIcon />
        </Button>
      )}

      {open ? (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-background p-2 shadow-md">
          {user ? (
            <>
              <Button variant="link" size="default" className="w-full items-start gap-2" asChild>
                <Link href={`/${lang}/dashboard`}>
                  <LayoutDashboardIcon className="h-4 w-4" />
                  {t.dashboard}
                </Link>
              </Button>
              <Button
                variant="link"
                size="default"
                className="w-full items-start gap-2"
                onClick={handleLogout}
              >
                <LogOutIcon className="h-4 w-4" />
                {t.logout}
              </Button>
            </>
          ) : (
            <Button variant="link" size="default" className="w-full items-start" onClick={handleLoginClick}>
              {t.login_or_sign_in}
            </Button>
          )}
        </div>
      ) : null}

      {loginOpen ? <LoginPopup onClose={() => setLoginOpen(false)} /> : null}
    </div>
  )
}
