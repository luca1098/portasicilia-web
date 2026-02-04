'use client'

import { useState, useRef, useEffect } from 'react'
import { UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'

export default function AccountMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const t = useTranslation() as Record<string, string>

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
      <Button variant="outline" size="icon" aria-label="Account" onClick={() => setOpen(prev => !prev)}>
        <UserIcon />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-background p-2 shadow-md">
          <Button variant="default" size="default" className="w-full" onClick={() => setOpen(false)}>
            {t.login ?? 'Login'}
          </Button>
        </div>
      )}
    </div>
  )
}
