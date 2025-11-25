export const supportedLocales = ['it', 'en'] as const

export const defaultLocale = 'it' as const

export type SupportedLocale = (typeof supportedLocales)[number]
