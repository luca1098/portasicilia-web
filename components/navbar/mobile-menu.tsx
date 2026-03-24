'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { XIcon, ChevronDownIcon, LayoutGridIcon } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { MenuItem } from '@/lib/constants/menu'
import { api } from '@/lib/api/fetch-client'
import type { Category } from '@/lib/schemas/entities/category.entity.schema'
import { cn } from '@/lib/utils/shadcn.utils'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  items: MenuItem[]
}

export default function MobileMenu({ open, onClose, items }: MobileMenuProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>

  useEffect(() => {
    if (open && categories.length === 0) {
      api
        .get<Category[]>('/categories/highlighted', {
          ...(lang !== 'it' && { params: { lang } }),
        })
        .then(setCategories)
        .catch(() => {})
    }
  }, [open, lang, categories.length])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="flex items-center justify-end p-4">
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
          <XIcon />
        </Button>
      </div>
      <nav className="flex flex-col items-center gap-6 px-6 pt-8">
        {items.map(item =>
          item.key === 'shop' ? (
            <div key="inspiration-and-shop" className="flex w-full flex-col items-center gap-6">
              {/* Lasciati ispirare with expandable categories */}
              <div className="flex w-full max-w-xs flex-col items-center">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center gap-1.5 text-lg font-medium transition-colors hover:text-primary"
                >
                  {t.get_inspired}
                  <ChevronDownIcon
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      categoriesOpen && 'rotate-180'
                    )}
                  />
                </button>

                {categoriesOpen && (
                  <div className="mt-4 flex w-full flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {categories.slice(0, 6).map(category => (
                      <Link
                        key={category.id}
                        href={`/${lang}/category/${category.slug}`}
                        onClick={onClose}
                        className="group relative flex h-20 items-end overflow-hidden rounded-xl"
                      >
                        {category.cover ? (
                          <Image
                            src={category.cover}
                            alt={category.name}
                            fill
                            className="object-cover"
                            sizes="300px"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 bg-muted" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <span className="relative z-10 px-3 pb-2 text-sm font-semibold text-white">
                          {category.name}
                        </span>
                      </Link>
                    ))}
                    <Link
                      href={`/${lang}/categories`}
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <LayoutGridIcon className="h-4 w-4" />
                      {t.explore_all_categories}
                    </Link>
                  </div>
                )}
              </div>

              {/* Shop link */}
              <Link
                href={`/${lang}${item.href}`}
                onClick={onClose}
                className="text-lg font-medium transition-colors hover:text-primary"
              >
                {t[item.key] ?? item.key}
              </Link>
            </div>
          ) : (
            <Link
              key={item.key}
              href={`/${lang}${item.href}`}
              onClick={onClose}
              className="text-lg font-medium transition-colors hover:text-primary"
            >
              {t[item.key] ?? item.key}
            </Link>
          )
        )}
      </nav>
    </div>
  )
}
