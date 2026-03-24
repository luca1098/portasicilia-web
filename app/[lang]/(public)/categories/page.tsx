import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from '@/lib/configs/locales/i18n'
import type { SupportedLocale } from '@/lib/configs/locales'
import { getCategories } from '@/lib/api/categories'

type CategoriesPageProps = {
  params: Promise<{ lang: string }>
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { lang } = await params
  const [t, categories] = await Promise.all([getTranslations(lang as SupportedLocale), getCategories(lang)])

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-8 md:pt-16">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t.categories_page_title}</h1>
          <p className="mt-3 text-muted-foreground">{t.categories_page_subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(category => (
            <Link
              key={category.id}
              href={`/${lang}/category/${category.slug}`}
              className="group relative flex h-56 items-end overflow-hidden rounded-2xl sm:h-64"
            >
              {category.cover ? (
                <Image
                  src={category.cover}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 bg-muted" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/80" />
              <div className="relative z-10 p-5">
                <h2 className="text-xl font-bold text-white drop-shadow-lg md:text-2xl">{category.name}</h2>
                {category.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-white/80">{category.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
