import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { SupportedLocale } from '@/lib/configs/locales'
import TestForm from '../components/test-form'

export default async function Home({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  return (
    <main className="flex flex-col min-h-screen items-center justify-center py-32 bg-zinc-50 font-sans dark:bg-black">
      <h1 className="mb-10">{t.welcome_title}</h1>
      <TestForm />
    </main>
  )
}
