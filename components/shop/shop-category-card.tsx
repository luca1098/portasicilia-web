'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShopCategory } from '@/lib/constants/shop-categories'

type ShopCategoryCardProps = {
  category: ShopCategory
  lang: string
  title: string
  description: string
  cta: string
}

export default function ShopCategoryCard({ category, lang, title, description, cta }: ShopCategoryCardProps) {
  return (
    <Link
      href={`/${lang}/shop/${category.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-3xl ${category.bgColor}`}
    >
      {/* Content */}
      <div className="flex flex-1 flex-col items-center px-6 pt-8 pb-4 text-center">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-gray-600">{description}</p>
        <button
          className={`mt-6 rounded-full px-8 py-3 text-sm font-medium text-white transition-colors ${category.buttonColor}`}
        >
          {cta}
        </button>
      </div>

      {/* Image */}
      <div className="relative mt-auto h-48 w-full">
        <Image
          src={category.image}
          alt={title}
          fill
          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
    </Link>
  )
}
