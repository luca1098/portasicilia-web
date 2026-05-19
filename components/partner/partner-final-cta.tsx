import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { Button } from '@/components/ui/button'

type Translations = Awaited<ReturnType<typeof getTranslations>>

type Props = { t: Translations; lang: string }

export default function PartnerFinalCta({ t, lang }: Props) {
  return (
    <section className="px-4 py-16">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl p-12 text-center text-white">
        <Image
          src="/images/partner-cta.jpg"
          alt={t.partner_final_cta_title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold drop-shadow-lg">{t.partner_final_cta_title}</h2>
          <p className="mt-3 drop-shadow opacity-90">{t.partner_final_cta_subtitle}</p>
          <Button asChild size="lg" className="mt-8 bg-white text-primary hover:bg-white/90">
            <Link href={`/${lang}/partner/candidatura`}>{t.partner_final_cta_button}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
