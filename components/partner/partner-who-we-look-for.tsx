'use client'

import { useTranslation } from '@/lib/context/translation.context'

type Item = { key: string; emoji: string }

const ROW_1: Item[] = [
  { key: 'partner_who_we_look_for_item_1', emoji: '🍷' },
  { key: 'partner_who_we_look_for_item_2', emoji: '⛵' },
  { key: 'partner_who_we_look_for_item_3', emoji: '🥾' },
  { key: 'partner_who_we_look_for_item_4', emoji: '🎨' },
  { key: 'partner_who_we_look_for_item_5', emoji: '🏍️' },
]

const ROW_2: Item[] = [
  { key: 'partner_who_we_look_for_item_6', emoji: '🐎' },
  { key: 'partner_who_we_look_for_item_7', emoji: '🍝' },
  { key: 'partner_who_we_look_for_item_8', emoji: '🤿' },
  { key: 'partner_who_we_look_for_item_9', emoji: '🌾' },
  { key: 'partner_who_we_look_for_item_10', emoji: '🏛️' },
]

const MASK_GRADIENT = 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)'

export default function PartnerWhoWeLookFor() {
  const t = useTranslation() as Record<string, string>

  return (
    <section className="bg-muted/30 px-4 py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-center">{t.partner_who_we_look_for_title}</h2>
        <div className="mt-10 space-y-5" style={{ maskImage: MASK_GRADIENT, WebkitMaskImage: MASK_GRADIENT }}>
          <MarqueeRow items={ROW_1} durationSeconds={40} />
          <MarqueeRow items={ROW_2} durationSeconds={50} reverse />
        </div>
      </div>
    </section>
  )
}

type MarqueeRowProps = { items: Item[]; durationSeconds: number; reverse?: boolean }

function MarqueeRow({ items, durationSeconds, reverse = false }: MarqueeRowProps) {
  const t = useTranslation() as Record<string, string>
  const duplicated = [...items, ...items]

  return (
    <div className="group flex overflow-hidden py-1">
      <div
        className={`flex shrink-0 gap-5 pr-5 hover:paused ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {duplicated.map((item, i) => (
          <span
            key={`${item.key}-${i}`}
            className="flex shrink-0 items-center gap-3 rounded-full bg-white px-8 py-5 text-xl font-medium shadow-md ring-1 ring-black/5"
          >
            <span className="text-3xl" aria-hidden>
              {item.emoji}
            </span>
            <span>{t[item.key]}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
