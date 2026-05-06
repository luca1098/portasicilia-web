import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'
import { Button } from '@/components/ui/button'

type ShopHeroProps = {
  lang: string
}

export default async function ShopHero({ lang }: ShopHeroProps) {
  const t = await getTranslations(lang as SupportedLocale)

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left: text */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                {t.shop_hero_subtitle}
              </p>
              <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                {t.shop_hero_title}
              </h1>
            </div>
            <Button asChild size="lg" className="w-fit rounded-full px-8">
              <a href="#products">{t.shop_hero_cta}</a>
            </Button>
          </div>

          {/* Right: image placeholder */}
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 md:aspect-[4/3]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-amber-300/60">
                <div className="size-24 rounded-full bg-amber-200/40" />
                <div className="h-2 w-32 rounded-full bg-amber-200/40" />
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 size-48 rounded-full bg-primary/5" />
            <div className="absolute -bottom-12 -left-12 size-64 rounded-full bg-amber-100/60" />
          </div>
        </div>
      </div>
    </section>
  )
}
