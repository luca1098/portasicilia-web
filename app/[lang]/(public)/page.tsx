import Link from 'next/link'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { SupportedLocale } from '@/lib/configs/locales'
import SearchBar from '@/components/search/search-bar'
import LocationList from '@/components/location/location-list'
import ExperienceList from '@/components/experience/experience-list'
import StayList from '@/components/stay/stay-list'
import CategoryGrid from '@/components/category/category-grid'
import ShopCategoryGrid from '@/components/shop/shop-category-grid'
import { getLocalities } from '@/lib/api/localities'
import { mockExperiences } from '@/lib/constants/experiences'
import { mockStays } from '@/lib/constants/stays'
import { mockCategories } from '@/lib/constants/categories'
import { mockShopCategories } from '@/lib/constants/shop-categories'
import { Button } from '@/components/ui/button'

export default async function Home({ params }: PageParamsProps) {
  const { lang } = await params
  const [t, locations] = await Promise.all([
    getTranslations(lang as SupportedLocale),
    getLocalities({ limit: 6 }),
  ])

  const experienceCategoryLabels: Record<string, string> = {
    conferma_immediata: t.experience_cat_conferma_immediata,
    specialita_culinaria: t.experience_cat_specialita_culinaria,
    adrenalina_pura: t.experience_cat_adrenalina_pura,
  }

  const categoryLabels: Record<string, string> = {
    category_fuga_romantica: t.category_fuga_romantica,
    category_profumo_di_mare: t.category_profumo_di_mare,
    category_madonie_segrete: t.category_madonie_segrete,
    category_terra_lavica: t.category_terra_lavica,
    category_immerso_nella_natura: t.category_immerso_nella_natura,
    category_nel_cuore_della_citta: t.category_nel_cuore_della_citta,
  }

  const shopCategoryLabels = {
    titles: {
      shop_cat_oro_verde_title: t.shop_cat_oro_verde_title,
      shop_cat_kit_cannolo_title: t.shop_cat_kit_cannolo_title,
      shop_cat_mistery_box_title: t.shop_cat_mistery_box_title,
    },
    descriptions: {
      shop_cat_oro_verde_description: t.shop_cat_oro_verde_description,
      shop_cat_kit_cannolo_description: t.shop_cat_kit_cannolo_description,
      shop_cat_mistery_box_description: t.shop_cat_mistery_box_description,
    },
    ctas: {
      shop_cat_oro_verde_cta: t.shop_cat_oro_verde_cta,
      shop_cat_kit_cannolo_cta: t.shop_cat_kit_cannolo_cta,
      shop_cat_mistery_box_cta: t.shop_cat_mistery_box_cta,
    },
  }

  return (
    <main>
      {/* Hero */}
      <section
        className="relative flex min-h-[50vh] flex-col items-center justify-center px-4"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
      >
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="text-center">
            <p className="mb-2 text-sm tracking-widest text-white/80">{t.hero_subtitle}</p>
            <h1 className="text-4xl font-bold leading-tight text-white drop-shadow-lg md:text-5xl lg:text-7xl max-w-2xl">
              {t.hero_title}
            </h1>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* Locations */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm text-muted-foreground">{t.home_locations_subtitle}</p>
          <h2 className="mt-1 text-3xl font-bold">{t.home_locations_title}</h2>
        </div>
        <LocationList locations={locations} lang={lang} subtitle={t.location_activities_subtitle} />
        <div className="mt-10 flex justify-center">
          <Button asChild>
            <Link href={`/${lang}/location`}>{t.home_cta_explore}</Link>
          </Button>
        </div>
      </section>

      {/* Experiences */}
      <section
        className="relative px-4 py-16 md:px-8 min-h-screen flex items-center"
        style={{
          backgroundImage: "url('/images/cover-experience.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 mx-auto max-w-7xl w-full">
          <h2 className="mb-10 text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
            {t.home_experiences_title}
          </h2>
          <ExperienceList
            experiences={mockExperiences}
            lang={lang}
            categoryLabels={experienceCategoryLabels}
          />
          <div className="mt-10 flex justify-center">
            <Button asChild>
              <Link href={`/${lang}/experiences`}>{t.home_cta_explore}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stays */}
      <section
        className="relative px-4 py-16 md:px-8 min-h-screen flex items-center"
        style={{
          backgroundImage: "url('/images/cover-stays.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: '70%',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 mx-auto max-w-7xl w-full">
          <h2 className="mb-10 text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
            {t.home_stays_title}
          </h2>
          <StayList stays={mockStays} lang={lang} categoryLabels={experienceCategoryLabels} />
          <div className="mt-10 flex justify-center">
            <Button asChild>
              <Link href={`/${lang}/stays`}>{t.home_cta_stays}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-10 text-center"></div>
        <CategoryGrid categories={mockCategories} lang={lang} labels={categoryLabels} />
      </section>

      {/* Shop Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-800 md:text-4xl">
          {t.home_shop_title}
        </h2>
        <ShopCategoryGrid categories={mockShopCategories} lang={lang} labels={shopCategoryLabels} />
        <div className="mt-10 flex justify-center">
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href={`/${lang}/shop`}>{t.home_shop_cta}</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
