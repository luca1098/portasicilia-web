import Link from 'next/link'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { SupportedLocale } from '@/lib/configs/locales'
import { Button } from '@/components/ui/button'

export default async function PartnerApplicationSuccessPage({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-primary">{t.partner_success_title}</h1>
        <p className="mt-4 text-muted-foreground">{t.partner_success_message}</p>
        <Button asChild className="mt-8">
          <Link href={`/${lang}`}>{t.partner_success_cta}</Link>
        </Button>
      </div>
    </main>
  )
}
