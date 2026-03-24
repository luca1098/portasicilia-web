'use client'

import type { Category } from '@/lib/schemas/entities/category.entity.schema'
import CategoryCard from './category-card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

type CornerRadius = 'tl' | 'tr' | 'bl' | 'br'

type CategoryGridProps = {
  categories: Category[]
  lang: string
}

const gridLayout: { className: string; corners: CornerRadius[] }[] = [
  { className: 'col-span-2 row-span-1', corners: ['tl'] },
  { className: 'row-span-2', corners: [] },
  { className: 'aspect-square', corners: ['tr'] },
  { className: 'aspect-square', corners: ['bl'] },
  { className: 'aspect-square', corners: [] },
  { className: 'aspect-square', corners: ['br'] },
]

export default function CategoryGrid({ categories, lang }: CategoryGridProps) {
  if (categories.length === 0) return null

  return (
    <>
      {/* Mobile carousel */}
      <div className="md:hidden">
        <Carousel opts={{ align: 'start', loop: true }}>
          <CarouselContent className="-ml-4">
            {categories.map(category => (
              <CarouselItem key={category.id} className="pl-4 basis-[85%]">
                <CategoryCard
                  category={category}
                  lang={lang}
                  className="aspect-4/3 rounded-xl md:rounded-none"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Tablet/Desktop grid */}
      <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-1">
        {categories.slice(0, 6).map((category, i) => {
          const layout = gridLayout[i]
          return (
            <CategoryCard
              key={category.id}
              category={category}
              lang={lang}
              className={layout.className}
              corners={layout.corners}
            />
          )
        })}
      </div>
    </>
  )
}
