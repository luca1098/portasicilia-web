import type { LucideIcon } from 'lucide-react'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { HandshakeIcon, ShieldCheckIcon, HeartIcon } from '@/lib/constants/icons'

type Translations = Awaited<ReturnType<typeof getTranslations>>

type Card = {
  icon: LucideIcon
  title: string
  desc: string
}

type Props = { t: Translations }

export default function WhyChooseSection({ t }: Props) {
  const cards: Card[] = [
    {
      icon: HandshakeIcon,
      title: t.why_choose_card_1_title,
      desc: t.why_choose_card_1_desc,
    },
    {
      icon: ShieldCheckIcon,
      title: t.why_choose_card_2_title,
      desc: t.why_choose_card_2_desc,
    },
    {
      icon: HeartIcon,
      title: t.why_choose_card_3_title,
      desc: t.why_choose_card_3_desc,
    },
  ]

  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{t.why_choose_title}</h2>
        </div>

        <ul className="mt-16 grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <li key={i} className="group relative">
                <div className="relative flex h-full flex-col items-center rounded-2xl border border-border/70 bg-card/80 px-6 pt-10 pb-7 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.18)]">
                  <div className="relative">
                    <Icon className="size-8 text-primary" strokeWidth={1.75} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
