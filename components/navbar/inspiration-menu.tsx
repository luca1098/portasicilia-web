'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronDownIcon, LayoutGridIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { api } from '@/lib/api/fetch-client'
import type { Category } from '@/lib/schemas/entities/category.entity.schema'
import { cn } from '@/lib/utils/shadcn.utils'

interface InspirationMenuProps {
  isTransparent?: boolean
}

export default function InspirationMenu({ isTransparent }: InspirationMenuProps) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200)
  }

  useEffect(() => {
    api
      .get<Category[]>('/categories/highlighted', {
        ...(lang !== 'it' && { params: { lang } }),
      })
      .then(setCategories)
      .catch(() => {})

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [lang])

  return (
    <div ref={menuRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        className={cn(
          'group relative flex items-center gap-1 px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200',
          isTransparent
            ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] hover:text-white'
            : 'text-foreground/70 hover:text-foreground'
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {t.get_inspired}
        <ChevronDownIcon
          className={cn('h-3.5 w-3.5 transition-transform duration-300', open && 'rotate-180')}
        />
        <span
          className={cn(
            'absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-primary transition-transform duration-300 origin-left',
            open && !isTransparent ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
          )}
        />
      </button>

      <div
        className={cn(
          'absolute left-1/2 top-full z-50 pt-2 -translate-x-1/2 transition-all duration-200',
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        )}
      >
        <div className="w-[540px] overflow-hidden rounded-2xl border border-border/60 bg-background/95 shadow-xl backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2 p-3">
            {categories.slice(0, 6).map((category, index) => (
              <Link
                key={category.id}
                href={`/${lang}/category/${category.slug}`}
                onClick={() => setOpen(false)}
                className="group relative flex h-28 items-end overflow-hidden rounded-xl"
                style={{ animationDelay: open ? `${index * 40}ms` : '0ms' }}
              >
                {category.cover ? (
                  <Image
                    src={category.cover}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="260px"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-colors duration-300 group-hover:from-black/80" />
                <span className="relative z-10 px-3 pb-2.5 text-sm font-semibold text-white drop-shadow-md">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="border-t border-border/50 px-3 py-2.5">
            <Link
              href={`/${lang}/categories`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LayoutGridIcon className="h-4 w-4" />
              {t.explore_all_categories}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
