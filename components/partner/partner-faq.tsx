import { getTranslations } from '@/lib/configs/locales/i18n'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type Translations = Awaited<ReturnType<typeof getTranslations>>

type Props = { t: Translations }

export default function PartnerFaq({ t }: Props) {
  const pairs = [
    { q: t.partner_faq_q1, a: t.partner_faq_a1 },
    { q: t.partner_faq_q2, a: t.partner_faq_a2 },
    { q: t.partner_faq_q3, a: t.partner_faq_a3 },
    { q: t.partner_faq_q4, a: t.partner_faq_a4 },
    { q: t.partner_faq_q5, a: t.partner_faq_a5 },
    { q: t.partner_faq_q6, a: t.partner_faq_a6 },
  ]
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold text-center">{t.partner_faq_title}</h2>
        <Accordion type="single" collapsible className="mt-8">
          {pairs.map((p, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{p.q}</AccordionTrigger>
              <AccordionContent>{p.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
