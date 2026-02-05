'use client'

import { useState, useRef, useEffect } from 'react'
import { UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import LoginPopup from '@/components/auth/login-popup'

export default function AccountMenu() {
  const [open, setOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const t = useTranslation()

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

  const handleLoginClick = () => {
    setOpen(false)
    setLoginOpen(true)
  }

  return (
    <div ref={ref} className="relative">
      <Button variant="outline" size="icon" aria-label="Account" onClick={() => setOpen(prev => !prev)}>
        <UserIcon />
      </Button>

      {open ? (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-background p-2 shadow-md">
          <Button variant="link" size="default" className="w-full items-start" onClick={handleLoginClick}>
            {t.login_or_sign_in}
          </Button>
        </div>
      ) : null}

      {loginOpen ? <LoginPopup onClose={() => setLoginOpen(false)} /> : null}
    </div>
  )
}
