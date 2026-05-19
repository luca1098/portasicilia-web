import { getTranslations } from '@/lib/configs/locales/i18n'
import { CircularTestimonials, type Testimonial } from '@/components/ui/circular-testimonials'

type Translations = Awaited<ReturnType<typeof getTranslations>>

type Props = { t: Translations }

export default function PartnerTestimonials({ t }: Props) {
  const testimonials: Testimonial[] = [
    {
      name: t.partner_testimonials_1_name,
      designation: t.partner_testimonials_1_designation,
      quote: t.partner_testimonials_1_quote,
      src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: t.partner_testimonials_2_name,
      designation: t.partner_testimonials_2_designation,
      quote: t.partner_testimonials_2_quote,
      src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: t.partner_testimonials_3_name,
      designation: t.partner_testimonials_3_designation,
      quote: t.partner_testimonials_3_quote,
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
    },
  ]

  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" />

      <div className="mx-auto flex max-w-6xl flex-col items-center">
        <h2 className="my-5 text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem]">
          {t.partner_testimonials_title}
        </h2>

        <div className="mt-14 flex w-full justify-center">
          <CircularTestimonials
            testimonials={testimonials}
            autoplay={false}
            previousAriaLabel={t.partner_testimonials_prev_aria}
            nextAriaLabel={t.partner_testimonials_next_aria}
          />
        </div>
      </div>
    </section>
  )
}
