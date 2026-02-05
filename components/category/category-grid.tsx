'use client'

import { Category } from '@/lib/constants/categories'
import CategoryCard from './category-card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

type CategoryGridProps = {
  categories: Category[]
  lang: string
  labels: Record<string, string>
}

export default function CategoryGrid({ categories, lang, labels }: CategoryGridProps) {
  // Expected order: fuga-romantica, profumo-di-mare, madonie-segrete, terra-lavica, immerso-nella-natura, nel-cuore-della-citta
  const [fugaRomantica, profumoDiMare, madonieSegrete, terraLavica, immersoNellaNatura, nelCuoreDellaCitta] =
    categories

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
                  label={labels[category.nameKey]}
                  className="aspect-[4/3]"
                  mobileRounded
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Tablet/Desktop grid */}
      <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-1">
        {/* Fuga romantica - top left, spans 2 columns */}
        <CategoryCard
          category={fugaRomantica}
          lang={lang}
          label={labels[fugaRomantica.nameKey]}
          className="col-span-2 row-span-1"
          corners={['tl']}
        />

        {/* Profumo di mare - center, spans 2 rows */}
        <CategoryCard
          category={profumoDiMare}
          lang={lang}
          label={labels[profumoDiMare.nameKey]}
          className="row-span-2"
          corners={[]}
        />

        {/* Madonie segrete - top right */}
        <CategoryCard
          category={madonieSegrete}
          lang={lang}
          label={labels[madonieSegrete.nameKey]}
          className="aspect-square"
          corners={['tr']}
        />

        {/* Terra Lavica - bottom left */}
        <CategoryCard
          category={terraLavica}
          lang={lang}
          label={labels[terraLavica.nameKey]}
          className="aspect-square"
          corners={['bl']}
        />

        {/* Immerso nella natura - bottom middle-left */}
        <CategoryCard
          category={immersoNellaNatura}
          lang={lang}
          label={labels[immersoNellaNatura.nameKey]}
          className="aspect-square"
          corners={[]}
        />

        {/* Nel cuore della città - bottom right */}
        <CategoryCard
          category={nelCuoreDellaCitta}
          lang={lang}
          label={labels[nelCuoreDellaCitta.nameKey]}
          className="aspect-square"
          corners={['br']}
        />
      </div>
    </>
  )
}
