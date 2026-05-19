import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'
import { LeafIcon, TruckIcon, ShieldCheckIcon, MapPinIcon } from '@/lib/constants/icons'

type TrustBadgesProps = {
  lang: string
}

export default async function TrustBadges({ lang }: TrustBadgesProps) {
  const t = await getTranslations(lang as SupportedLocale)

  const badges = [
    { icon: LeafIcon, title: t.shop_trust_eco_title, desc: t.shop_trust_eco_desc },
    { icon: TruckIcon, title: t.shop_trust_shipping_title, desc: t.shop_trust_shipping_desc },
    { icon: ShieldCheckIcon, title: t.shop_trust_fast_title, desc: t.shop_trust_fast_desc },
    { icon: MapPinIcon, title: t.shop_trust_sicily_title, desc: t.shop_trust_sicily_desc },
  ]

  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-12">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
          {badges.map(badge => {
            const Icon = badge.icon
            return (
              <li key={badge.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="size-4 text-primary" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-foreground">{badge.title}</p>
                  <p className="text-xs leading-snug text-muted-foreground">{badge.desc}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
