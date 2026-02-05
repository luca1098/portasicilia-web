'use client'

import { ShopCategory } from '@/lib/constants/shop-categories'
import ShopCategoryCard from './shop-category-card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

type ShopCategoryGridProps = {
  categories: ShopCategory[]
  lang: string
  labels: {
    titles: Record<string, string>
    descriptions: Record<string, string>
    ctas: Record<string, string>
  }
}

export default function ShopCategoryGrid({ categories, lang, labels }: ShopCategoryGridProps) {
  return (
    <>
      {/* Mobile carousel - one item visible */}
      <div className="sm:hidden">
        <Carousel opts={{ align: 'start', loop: true }}>
          <CarouselContent className="-ml-4">
            {categories.map(category => (
              <CarouselItem key={category.id} className="pl-4 basis-[85%]">
                <ShopCategoryCard
                  category={category}
                  lang={lang}
                  title={labels.titles[category.titleKey]}
                  description={labels.descriptions[category.descriptionKey]}
                  cta={labels.ctas[category.ctaKey]}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Tablet/Desktop grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <ShopCategoryCard
            key={category.id}
            category={category}
            lang={lang}
            title={labels.titles[category.titleKey]}
            description={labels.descriptions[category.descriptionKey]}
            cta={labels.ctas[category.ctaKey]}
          />
        ))}
      </div>
    </>
  )
}
