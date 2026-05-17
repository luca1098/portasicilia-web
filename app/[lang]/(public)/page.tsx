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
import { getLocalityCards } from '@/lib/api/localities'
import { getExperienceCards } from '@/lib/api/experiences'
import { getStayCards } from '@/lib/api/stays'
import { getHighlightedCategories } from '@/lib/api/categories'
import { getFeaturedSocialVideos } from '@/lib/api/social-videos'
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

  return (
    <main>
      <JsonLd data={[organizationSchema(), websiteSchema(lang)]} />

      {/* Hero */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center px-4 md:min-h-[50vh]">
        <video
          src="/videos/hero-bg.mp4"
          poster="/images/hero-bg.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={t.seo_hero_alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold leading-tight text-white [text-shadow:0_2px_16px_rgb(0_0_0/55%)] md:text-5xl lg:text-7xl max-w-2xl">
              {t.hero_title}
            </h1>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 z-20 w-full max-w-xl -translate-x-1/2 translate-y-1/2 px-4">
          <SearchBar />
        </div>
      </section>

      {/* Locations */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-24 md:px-8 md:pt-28">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">{t.home_locations_title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t.home_locations_subtitle}</p>
        </div>
        <LocationCardList locations={locationCards} lang={lang} />
        <div className="mt-10 flex justify-center">
          <Button asChild>
            <Link href={`/${lang}/location`}>{t.home_locations_cta}</Link>
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
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
              {t.home_experiences_title}
            </h2>
            <p className="mt-2 text-sm text-white/85 drop-shadow md:text-base">
              {t.home_experiences_subtitle}
            </p>
          </div>
          <ExperienceCardList experiences={experienceCards} lang={lang} darkBg />
          <div className="mt-10 flex justify-center">
            <Button asChild>
              <Link href={`/${lang}/experiences`}>{t.home_experiences_cta}</Link>
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
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg md:text-4xl">{t.home_stays_title}</h2>
            <p className="mt-2 text-sm text-white/85 drop-shadow md:text-base">{t.home_stays_subtitle}</p>
          </div>
          <StayList stays={stayCards} lang={lang} darkBg />
          <div className="mt-10 flex justify-center">
            <Button asChild>
              <Link href={`/${lang}/stays`}>{t.home_stays_cta}</Link>
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

      {/* Become Partner Banner */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src="/images/partner-banner.jpg"
            alt={t.home_partner_banner_title}
            width={1280}
            height={400}
            className="h-64 w-full object-cover md:h-80"
            sizes="(max-width: 768px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg md:text-5xl">
              {t.home_partner_banner_title}
            </h2>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href={`/${lang}/partner`}>{t.home_partner_banner_cta}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
