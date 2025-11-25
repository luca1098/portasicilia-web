import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import ClientButton from './components/client-button'
import { SupportedLocale } from '@/lib/configs/locales'

export default async function Home({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  return (
    <main className="flex min-h-screen items-center py-32 bg-zinc-50 font-sans dark:bg-black flex-col gap-4">
      <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        {t.hello_world}
      </h1>
      <ClientButton />
    </main>
  )
}
