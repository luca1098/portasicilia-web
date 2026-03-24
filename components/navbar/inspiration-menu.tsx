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

export default function InspirationMenu() {
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
        className="text-md flex items-center gap-1 font-medium transition-colors hover:text-primary"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {t.get_inspired}
        <ChevronDownIcon className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 pt-3 -translate-x-1/2">
          <div className="w-[520px] overflow-hidden rounded-2xl border bg-background shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 p-3">
              {categories.slice(0, 6).map(category => (
                <Link
                  key={category.id}
                  href={`/${lang}/category/${category.slug}`}
                  onClick={() => setOpen(false)}
                  className="group relative flex h-28 items-end overflow-hidden rounded-xl"
                >
                  {category.cover ? (
                    <Image
                      src={category.cover}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="250px"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="relative z-10 px-3 pb-2.5 text-sm font-semibold text-white drop-shadow-md">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>

            <div className="border-t px-3 py-2.5">
              <Link
                href={`/${lang}/categories`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LayoutGridIcon className="h-4 w-4" />
                {t.explore_all_categories}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
