import type { LucideIcon } from 'lucide-react'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { ClipboardListIcon, ShieldCheckIcon, UserCheckIcon, SparklesIcon } from '@/lib/constants/icons'

type Translations = Awaited<ReturnType<typeof getTranslations>>

type Step = {
  icon: LucideIcon
  title: string
  desc: string
}

type Props = { t: Translations }

export default function PartnerHowItWorks({ t }: Props) {
  const steps: Step[] = [
    {
      icon: ClipboardListIcon,
      title: t.partner_how_it_works_step_1_title,
      desc: t.partner_how_it_works_step_1_desc,
    },
    {
      icon: ShieldCheckIcon,
      title: t.partner_how_it_works_step_2_title,
      desc: t.partner_how_it_works_step_2_desc,
    },
    {
      icon: UserCheckIcon,
      title: t.partner_how_it_works_step_3_title,
      desc: t.partner_how_it_works_step_3_desc,
    },
    {
      icon: SparklesIcon,
      title: t.partner_how_it_works_step_4_title,
      desc: t.partner_how_it_works_step_4_desc,
    },
  ]

  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" />

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem]">
            {t.partner_how_it_works_title}
          </h2>
        </div>

        <ol className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div aria-hidden className="absolute left-[12.5%] right-[12.5%] top-20 hidden h-px lg:block" />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <li key={i} className="group relative">
                <div className="relative flex h-full flex-col items-center rounded-2xl border border-border/70 bg-card/80 px-6 pt-10 pb-7 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.18)]">
                  <div className="relative">
                    <Icon className="size-8 text-primary" strokeWidth={1.75} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
