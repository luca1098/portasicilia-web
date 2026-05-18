import Link from 'next/link'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { Button } from '@/components/ui/button'

type Translations = Awaited<ReturnType<typeof getTranslations>>

type Props = { t: Translations; lang: string }

export default function PartnerHero({ t, lang }: Props) {
  return (
    <section className="relative flex min-h-[55vh] flex-col items-center justify-center px-4 text-center text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a4d3a] to-[#2d7d5f]" />
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">{t.partner_hero_title}</h1>
        <p className="mt-6 text-lg md:text-xl">{t.partner_hero_subtitle}</p>
        <Button asChild size="lg" className="mt-8 bg-white text-[#1a4d3a] hover:bg-white/90">
          <Link href={`/${lang}/partner/candidatura`}>{t.partner_hero_cta}</Link>
        </Button>
      </div>
    </section>
  )
}
