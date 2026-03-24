import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getTranslations } from '@/lib/configs/locales/i18n'
import type { SupportedLocale } from '@/lib/configs/locales'
import { getCategoryBySlug } from '@/lib/api/categories'
import { getExperienceCards } from '@/lib/api/experiences'
import { getStayCards } from '@/lib/api/stays'
import CategoryListingsSection from '@/components/category/category-listings-section'
import ExperienceCardItem from '@/components/experience/experience-card-item'
import StayCardComponent from '@/components/stay/stay-card'

type CategoryPageProps = {
  params: Promise<{ lang: string; slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { lang, slug } = await params
  const t = await getTranslations(lang as SupportedLocale)

  let category
  try {
    category = await getCategoryBySlug(slug, lang)
  } catch {
    notFound()
  }

  const [experienceCards, stayCards] = await Promise.all([
    getExperienceCards({ categoryId: category.id, limit: 12 }),
    getStayCards({ categoryId: category.id, limit: 12 }),
  ])

  return (
    <main className="min-h-screen">
      {category.cover && (
        <section className="relative h-[40vh] w-full overflow-hidden">
          <Image src={category.cover} alt={category.name} fill className="object-cover" priority />
        </section>
      )}

      <section className="mx-auto max-w-4xl px-4 py-12 text-center md:py-16">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{category.name}</h1>
        {category.description && (
          <p className="mt-4 leading-relaxed text-muted-foreground">{category.description}</p>
        )}
      </section>

      {experienceCards.data.length > 0 && (
        <CategoryListingsSection title={t.category_experiences_title}>
          {experienceCards.data.map(exp => (
            <div key={exp.id} className="w-[200px] shrink-0">
              <ExperienceCardItem experience={exp} lang={lang} />
            </div>
          ))}
        </CategoryListingsSection>
      )}

      {stayCards.data.length > 0 && (
        <CategoryListingsSection title={t.category_stays_title}>
          {stayCards.data.map(stay => (
            <div key={stay.id} className="w-[200px] shrink-0">
              <StayCardComponent stay={stay} lang={lang} />
            </div>
          ))}
        </CategoryListingsSection>
      )}

      {experienceCards.data.length === 0 && stayCards.data.length === 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
          <p className="text-center text-muted-foreground">{t.category_coming_soon}</p>
        </section>
      )}
    </main>
  )
}
