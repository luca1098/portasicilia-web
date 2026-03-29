export const SITE_NAME = 'Porta Sicilia'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.portasicilia.com'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.png`

export const SITE_LOCALE_MAP = {
  it: 'it_IT',
  en: 'en_GB',
} as const

export const ORGANIZATION = {
  name: 'Porta Sicilia',
  legalName: 'GUARNERI SALVATORE',
  url: SITE_URL,
  logo: `${SITE_URL}/logo-full.png`,
  address: {
    streetAddress: 'Cortile Gonzales 7',
    addressLocality: 'Lercara Friddi',
    addressRegion: 'PA',
    postalCode: '90025',
    addressCountry: 'IT',
  },
  phone: '+393274522382',
  vatID: '07069930829',
}

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/p/Porta-Sicilia-61575665175756/',
  instagram: 'https://www.instagram.com/porta_sicilia/',
  tiktok: 'https://www.tiktok.com/@porta_sicilia',
}
