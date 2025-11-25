import { PropsWithChildren } from 'react'
import { PageParamsProps } from '../types/page.type'
import TranslationContext from '../context/translation.context'
import { getTranslations } from '../configs/locales/i18n'
import { SupportedLocale } from '../configs/locales'

type ProviderProps = PageParamsProps & PropsWithChildren

export default async function Providers({ children, params }: ProviderProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)
  return <TranslationContext t={t}>{children}</TranslationContext>
}
