'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
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
  const [animating, setAnimating] = useState(false)
  const params = useParams()
  const pathname = usePathname()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>

  const isActiveLink = useCallback(
    (href: string) => {
      const fullHref = `/${lang}${href}`
      return pathname === fullHref || pathname.startsWith(`${fullHref}/`)
    },
    [lang, pathname]
  )

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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => setAnimating(true))
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open && !animating) return null

  const handleClose = () => {
    setAnimating(false)
    setTimeout(onClose, 300)
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
          animating ? 'opacity-100' : 'opacity-0'
        )}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'absolute inset-y-0 right-0 w-full max-w-sm bg-background shadow-2xl transition-transform duration-300 ease-out',
          animating ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-5 py-4">
            <Image src="/logo.png" alt="Porta Sicilia" width={36} height={36} />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              aria-label="Close menu"
              className="rounded-full"
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col px-5 py-6">
            {items.map((item, index) =>
              item.key === 'shop' ? (
                <div
                  key="inspiration-and-shop"
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-in fade-in slide-in-from-right-4 fill-mode-both"
                >
                  {/* Get Inspired with expandable categories */}
                  <div className="border-b border-border/50">
                    <button
                      onClick={() => setCategoriesOpen(!categoriesOpen)}
                      className={cn(
                        'flex w-full items-center justify-between py-4 text-base font-medium transition-colors',
                        categoriesOpen ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {t.get_inspired}
                      <ChevronDownIcon
                        className={cn(
                          'h-4 w-4 transition-transform duration-300',
                          categoriesOpen && 'rotate-180'
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        'grid transition-all duration-300 ease-out',
                        categoriesOpen ? 'grid-rows-[1fr] opacity-100 pb-4' : 'grid-rows-[0fr] opacity-0'
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="grid grid-cols-2 gap-2">
                          {categories.slice(0, 6).map((category, catIndex) => (
                            <Link
                              key={category.id}
                              href={`/${lang}/category/${category.slug}`}
                              onClick={handleClose}
                              className="group relative flex h-20 items-end overflow-hidden rounded-xl"
                              style={{ animationDelay: `${catIndex * 60}ms` }}
                            >
                              {category.cover ? (
                                <Image
                                  src={category.cover}
                                  alt={category.name}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                  sizes="150px"
                                  unoptimized
                                />
                              ) : (
                                <div className="absolute inset-0 bg-muted" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                              <span className="relative z-10 px-2.5 pb-2 text-xs font-semibold text-white drop-shadow-md">
                                {category.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <Link
                          href={`/${lang}/categories`}
                          onClick={handleClose}
                          className="mt-2 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <LayoutGridIcon className="h-3.5 w-3.5" />
                          {t.explore_all_categories}
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Shop link */}
                  <Link
                    href={`/${lang}${item.href}`}
                    onClick={handleClose}
                    className={cn(
                      'flex items-center border-b border-border/50 py-4 text-base font-medium transition-colors',
                      isActiveLink(item.href) ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {t[item.key] ?? item.key}
                    {isActiveLink(item.href) && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                </div>
              ) : (
                <Link
                  key={item.key}
                  href={`/${lang}${item.href}`}
                  onClick={handleClose}
                  className={cn(
                    'flex items-center border-b border-border/50 py-4 text-base font-medium transition-colors animate-in fade-in slide-in-from-right-4 fill-mode-both',
                    isActiveLink(item.href) ? 'text-primary' : 'text-foreground'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {t[item.key] ?? item.key}
                  {isActiveLink(item.href) && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
