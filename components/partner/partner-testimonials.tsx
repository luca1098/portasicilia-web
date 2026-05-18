import { getTranslations } from '@/lib/configs/locales/i18n'

type Translations = Awaited<ReturnType<typeof getTranslations>>

type Props = { t: Translations }

export default function PartnerTestimonials({ t }: Props) {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold">{t.partner_testimonials_title}</h2>
        <p className="mt-6 italic text-muted-foreground">{t.partner_testimonials_placeholder}</p>
      </div>
    </section>
  )
}
