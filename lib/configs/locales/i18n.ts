import { SupportedLocale } from '@/lib/configs/locales'
import 'server-only'

const translations = {
  en: () => import('../../../i18n/en.json').then(module => module.default),
  it: () => import('../../../i18n/it.json').then(module => module.default),
}

export const getTranslations = async (locale: SupportedLocale) => translations[locale]()
