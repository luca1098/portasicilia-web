export const supportedLocales = ['it', 'en', 'es', 'fr', 'de'] as const

export const defaultLocale = 'it' as const

export type SupportedLocale = (typeof supportedLocales)[number]
