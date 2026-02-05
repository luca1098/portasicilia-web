import { notFound } from 'next/navigation'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'
import { mockCategories } from '@/lib/constants/categories'

type CategoryPageProps = {
  params: Promise<{ lang: string; slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { lang, slug } = await params
  const t = await getTranslations(lang as SupportedLocale)

  const category = mockCategories.find(c => c.id === slug)

  if (!category) {
    notFound()
  }

  const categoryLabels: Record<string, string> = {
    category_fuga_romantica: t.category_fuga_romantica,
    category_profumo_di_mare: t.category_profumo_di_mare,
    category_madonie_segrete: t.category_madonie_segrete,
    category_terra_lavica: t.category_terra_lavica,
    category_immerso_nella_natura: t.category_immerso_nella_natura,
    category_nel_cuore_della_citta: t.category_nel_cuore_della_citta,
  }

  const categoryName = categoryLabels[category.nameKey]

  return (
    <main className="min-h-screen">
      <section
        className="relative flex h-[40vh] items-end px-4 pb-12 md:px-8"
        style={{
          backgroundImage: `url('${category.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl">{categoryName}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <p className="text-center text-muted-foreground">{t.category_coming_soon}</p>
      </section>
    </main>
  )
}
