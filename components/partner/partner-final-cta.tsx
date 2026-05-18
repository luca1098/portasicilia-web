import Link from 'next/link'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { Button } from '@/components/ui/button'

type Translations = Awaited<ReturnType<typeof getTranslations>>

type Props = { t: Translations; lang: string }

export default function PartnerFinalCta({ t, lang }: Props) {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl bg-[#1a4d3a] p-12 text-center text-white">
        <h2 className="text-3xl font-bold">{t.partner_final_cta_title}</h2>
        <p className="mt-3 opacity-90">{t.partner_final_cta_subtitle}</p>
        <Button asChild size="lg" className="mt-8 bg-white text-[#1a4d3a] hover:bg-white/90">
          <Link href={`/${lang}/partner/candidatura`}>{t.partner_final_cta_button}</Link>
        </Button>
      </div>
    </section>
  )
}
