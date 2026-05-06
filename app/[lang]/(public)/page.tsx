import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { SupportedLocale } from '@/lib/configs/locales'
import { buildMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/lib/seo/json-ld'
import { organizationSchema, websiteSchema } from '@/lib/seo/schema'
import SearchBar from '@/components/search/search-bar'
import LocationCardList from '@/components/location/location-card-list'
import ExperienceCardList from '@/components/experience/experience-card-list'
import StayList from '@/components/stay/stay-list'
import CategoryGrid from '@/components/category/category-grid'
import ShopCategoryGrid from '@/components/shop/shop-category-grid'
import { getLocalityCards } from '@/lib/api/localities'
import { getExperienceCards } from '@/lib/api/experiences'
import { getStayCards } from '@/lib/api/stays'
import { getHighlightedCategories } from '@/lib/api/categories'
import { getFeaturedSocialVideos } from '@/lib/api/social-videos'
import { mockShopCategories } from '@/lib/constants/shop-categories'
import { Button } from '@/components/ui/button'
import SocialVideoSection from '@/components/social-video/social-video-section'

export async function generateMetadata({ params }: PageParamsProps): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)
  return buildMetadata({
    title: t.seo_home_title,
    description: t.seo_home_description,
    path: '',
    locale: lang,
  })
}

export default async function Home({ params }: PageParamsProps) {
  const { lang } = await params
  const [
    t,
    { data: locationCards },
    { data: experienceCards },
    { data: stayCards },
    highlightedCategories,
    socialVideosData,
  ] = await Promise.all([
    getTranslations(lang as SupportedLocale),
    getLocalityCards({ limit: 6, highlighted: true }),
    getExperienceCards({ limit: 6, highlighted: true }),
    getStayCards({ limit: 6, highlighted: true }),
    getHighlightedCategories(lang),
    getFeaturedSocialVideos().catch(() => null),
  ])

  const socialVideos = Array.isArray(socialVideosData) ? socialVideosData : []

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
      <JsonLd data={[organizationSchema(), websiteSchema(lang)]} />

      {/* Hero */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-4">
        <Image
          src="/images/hero-bg.png"
          alt={t.seo_hero_alt}
          fill
          className="object-cover object-bottom"
          priority
          sizes="100vw"
        />
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
        <LocationCardList locations={locationCards} lang={lang} />
        <div className="mt-10 flex justify-center">
          <Button asChild>
            <Link href={`/${lang}/location`}>{t.home_cta_explore}</Link>
          </Button>
        </div>
      </section>

      {/* Experiences */}
      <section className="relative px-4 py-16 md:px-8 min-h-screen flex items-center">
        <Image
          src="/images/cover-experience.png"
          alt={t.seo_experiences_cover_alt}
          fill
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 mx-auto max-w-7xl w-full">
          <h2 className="mb-10 text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
            {t.home_experiences_title}
          </h2>
          <ExperienceCardList experiences={experienceCards} lang={lang} darkBg />
          <div className="mt-10 flex justify-center">
            <Button asChild>
              <Link href={`/${lang}/experiences`}>{t.home_cta_explore}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stays */}
      <section className="relative px-4 py-16 md:px-8 min-h-screen flex items-center">
        <Image
          src="/images/cover-stays.jpg"
          alt={t.seo_stays_cover_alt}
          fill
          className="object-cover"
          style={{ objectPosition: '70%' }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 mx-auto max-w-7xl w-full">
          <h2 className="mb-10 text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
            {t.home_stays_title}
          </h2>
          <StayList stays={stayCards} lang={lang} darkBg />
          <div className="mt-10 flex justify-center">
            <Button asChild>
              <Link href={`/${lang}/stays`}>{t.home_cta_stays}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      {highlightedCategories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <CategoryGrid categories={highlightedCategories} lang={lang} />
        </section>
      )}

      {/* Social Videos */}
      {socialVideos.length > 0 && (
        <SocialVideoSection videos={socialVideos} title={t.home_social_videos_title} lang={lang} />
      )}

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
