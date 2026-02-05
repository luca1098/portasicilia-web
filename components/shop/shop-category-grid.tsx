import { ShopCategory } from '@/lib/constants/shop-categories'
import ShopCategoryCard from './shop-category-card'

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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  )
}
