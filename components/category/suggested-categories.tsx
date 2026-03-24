import type { Category } from '@/lib/schemas/entities/category.entity.schema'
import CategoryCard from '@/components/category/category-card'

type SuggestedCategoriesProps = {
  title: string
  categories: Category[]
  lang: string
}

export default function SuggestedCategories({ title, categories, lang }: SuggestedCategoriesProps) {
  if (categories.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            lang={lang}
            className="aspect-[16/10] rounded-2xl"
          />
        ))}
      </div>
    </section>
  )
}
