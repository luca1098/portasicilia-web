import Image from 'next/image'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'
import type { ShopCategory } from '@/lib/schemas/entities/product.entity.schema'
import { LeafIcon, ShieldCheckIcon, TruckIcon } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'

type ShopHeroProps = {
  lang: string
  category: ShopCategory | null
}

export default async function ShopHero({ lang, category }: ShopHeroProps) {
  const t = await getTranslations(lang as SupportedLocale)

  const eyebrow = category?.name ?? t.shop_hero_eyebrow
  const subtitle = category?.description ?? t.shop_hero_subtitle
  const cover = category?.cover ?? null

  const trustItems = [
    {
      icon: ShieldCheckIcon,
      title: t.shop_hero_badge_authentic_title,
      desc: t.shop_hero_badge_authentic_desc,
    },
    {
      icon: TruckIcon,
      title: t.shop_hero_badge_shipping_title,
      desc: t.shop_hero_badge_shipping_desc,
    },
    {
      icon: LeafIcon,
      title: t.shop_hero_badge_eco_title,
      desc: t.shop_hero_badge_eco_desc,
    },
  ]

  return (
    <section className="relative -mt-11 bg-background pb-24 md:pb-28">
      <div className="relative overflow-hidden bg-foreground">
        <Image
          src={cover ?? '/images/shop-hero-bg.png'}
          alt={category?.name ?? eyebrow}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized={Boolean(cover)}
        />

        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-20 md:min-h-[660px] md:px-8 md:py-28 lg:py-24">
          <div className="flex max-w-2xl flex-col gap-7">
            <h1 className="text-balance text-4xl font-semibold leading-[1.02] tracking-tight text-background md:text-6xl lg:text-7xl">
              {t.shop_hero_title_lead}
            </h1>

            <p className="max-w-md text-base leading-relaxed text-background/85 md:text-lg">{subtitle}</p>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <a href="#products">{t.shop_hero_cta}</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-14 max-w-7xl px-4 md:-mt-16 md:px-8">
        <div className="rounded-2xl border border-border bg-card px-5 py-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.25)] md:px-8 md:py-6">
          <ul className="grid gap-5 md:grid-cols-3 md:gap-8">
            {trustItems.map(item => {
              const Icon = item.icon
              return (
                <li key={item.title} className="flex items-center gap-3 md:gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 md:size-11">
                    <Icon className="size-5 text-primary" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold text-foreground md:text-[15px]">{item.title}</p>
                    <p className="text-xs leading-snug text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
