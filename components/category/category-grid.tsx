import { Category } from '@/lib/constants/categories'
import CategoryCard from './category-card'

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
    <div className="grid grid-cols-2 gap-1 md:grid-cols-4 md:grid-rows-2">
      {/* Fuga romantica - top left, spans 2 columns */}
      <CategoryCard
        category={fugaRomantica}
        lang={lang}
        label={labels[fugaRomantica.nameKey]}
        className="col-span-2 aspect-2/1 md:aspect-auto md:row-span-1"
        corners={['tl']}
      />

      {/* Profumo di mare - center, spans 2 rows */}
      <CategoryCard
        category={profumoDiMare}
        lang={lang}
        label={labels[profumoDiMare.nameKey]}
        className="aspect-square md:row-span-2 md:aspect-auto"
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
  )
}
