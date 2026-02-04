'use client'

import { XIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { MenuItem } from '@/lib/constants/menu'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  items: MenuItem[]
}

export default function MobileMenu({ open, onClose, items }: MobileMenuProps) {
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex items-center justify-end p-4">
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
          <XIcon />
        </Button>
      </div>
      <nav className="flex flex-col items-center gap-6 pt-12">
        {items.map(item => (
          <Link
            key={item.key}
            href={`/${lang}${item.href}`}
            onClick={onClose}
            className="text-lg font-medium transition-colors hover:text-primary"
          >
            {t[item.key] ?? item.key}
          </Link>
        ))}
      </nav>
    </div>
  )
}
