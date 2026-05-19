import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { Button } from '@/components/ui/button'

type Translations = Awaited<ReturnType<typeof getTranslations>>

type Props = { t: Translations; lang: string }

export default function PartnerHero({ t, lang }: Props) {
  return (
    <section className="relative flex min-h-[55vh] flex-col items-center justify-center px-4 text-center text-white overflow-hidden">
      <Image
        src="/images/partner-banner.jpg"
        alt={t.partner_hero_title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-4xl font-bold leading-tight drop-shadow-lg md:text-5xl lg:text-6xl">
          {t.partner_hero_title}
        </h1>
        <p className="mt-6 text-lg drop-shadow md:text-xl max-w-xl mx-auto">{t.partner_hero_subtitle}</p>
        <Button asChild size="lg" className="mt-8 bg-white text-primary hover:bg-white/90">
          <Link href={`/${lang}/partner/candidatura`}>{t.partner_hero_cta}</Link>
        </Button>
      </div>
    </section>
  )
}
