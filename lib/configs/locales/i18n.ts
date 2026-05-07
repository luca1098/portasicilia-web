import { SupportedLocale } from '@/lib/configs/locales'
import 'server-only'

const translations = {
  en: () => import('../../../i18n/en.json').then(module => module.default),
  it: () => import('../../../i18n/it.json').then(module => module.default),
  es: () => import('../../../i18n/es.json').then(module => module.default),
  fr: () => import('../../../i18n/fr.json').then(module => module.default),
  de: () => import('../../../i18n/de.json').then(module => module.default),
}

export const getTranslations = async (locale: SupportedLocale) => translations[locale]()
