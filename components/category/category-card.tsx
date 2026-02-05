'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Category } from '@/lib/constants/categories'

type CornerRadius = 'tl' | 'tr' | 'bl' | 'br'

type CategoryCardProps = {
  category: Category
  lang: string
  label: string
  className?: string
  corners?: CornerRadius[]
  mobileRounded?: boolean
}

const cornerClasses: Record<CornerRadius, string> = {
  tl: 'md:rounded-tl-2xl',
  tr: 'md:rounded-tr-2xl',
  bl: 'md:rounded-bl-2xl',
  br: 'md:rounded-br-2xl',
}

export default function CategoryCard({
  category,
  lang,
  label,
  className = '',
  corners = [],
  mobileRounded,
}: CategoryCardProps) {
  const radiusClasses = corners.map(c => cornerClasses[c]).join(' ')
  const mobileRadiusClass = mobileRounded ? 'rounded-xl md:rounded-none' : ''

  return (
    <Link
      href={`/${lang}/category/${category.id}`}
      className={`group relative block overflow-hidden ${mobileRadiusClass} ${radiusClasses} ${className}`}
    >
      <Image
        src={category.image}
        alt={label}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* Label */}
      <span className="absolute bottom-4 left-4 text-xl font-bold text-white drop-shadow-lg md:text-2xl">
        {label}
      </span>
    </Link>
  )
}
