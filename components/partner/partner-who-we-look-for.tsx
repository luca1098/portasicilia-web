import { getTranslations } from '@/lib/configs/locales/i18n'

type Translations = Awaited<ReturnType<typeof getTranslations>>

type Props = { t: Translations }

export default function PartnerWhoWeLookFor({ t }: Props) {
  const items = [
    t.partner_who_we_look_for_item_1,
    t.partner_who_we_look_for_item_2,
    t.partner_who_we_look_for_item_3,
    t.partner_who_we_look_for_item_4,
    t.partner_who_we_look_for_item_5,
    t.partner_who_we_look_for_item_6,
  ]
  return (
    <section className="bg-muted/30 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-center">{t.partner_who_we_look_for_title}</h2>
        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {items.map(label => (
            <li key={label} className="rounded-full bg-white px-5 py-2 text-sm shadow-sm">
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
