import { getTranslations } from '@/lib/configs/locales/i18n'

type Translations = Awaited<ReturnType<typeof getTranslations>>

type Props = { t: Translations }

export default function PartnerHowItWorks({ t }: Props) {
  const steps = [
    { title: t.partner_how_it_works_step_1_title, desc: t.partner_how_it_works_step_1_desc },
    { title: t.partner_how_it_works_step_2_title, desc: t.partner_how_it_works_step_2_desc },
    { title: t.partner_how_it_works_step_3_title, desc: t.partner_how_it_works_step_3_desc },
    { title: t.partner_how_it_works_step_4_title, desc: t.partner_how_it_works_step_4_desc },
  ]
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-center">{t.partner_how_it_works_title}</h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={i} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1a4d3a] text-white text-lg font-bold">
                {i + 1}
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
