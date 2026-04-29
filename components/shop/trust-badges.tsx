import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'
import { LeafIcon, TruckIcon, ShieldCheckIcon, MapPinIcon } from '@/lib/constants/icons'

type TrustBadgesProps = {
  lang: string
}

export default async function TrustBadges({ lang }: TrustBadgesProps) {
  const t = await getTranslations(lang as SupportedLocale)

  const badges = [
    {
      icon: LeafIcon,
      title: t.shop_trust_eco_title,
      desc: t.shop_trust_eco_desc,
    },
    {
      icon: TruckIcon,
      title: t.shop_trust_shipping_title,
      desc: t.shop_trust_shipping_desc,
    },
    {
      icon: ShieldCheckIcon,
      title: t.shop_trust_fast_title,
      desc: t.shop_trust_fast_desc,
    },
    {
      icon: MapPinIcon,
      title: t.shop_trust_sicily_title,
      desc: t.shop_trust_sicily_desc,
    },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map(badge => {
          const Icon = badge.icon
          return (
            <div
              key={badge.title}
              className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-card p-6 text-center shadow-sm"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="size-6 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">{badge.title}</h3>
              <p className="text-xs leading-relaxed text-gray-500">{badge.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
