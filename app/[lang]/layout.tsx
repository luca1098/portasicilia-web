import { PageParamsProps } from '@/lib/types/page.type'
import { PropsWithChildren } from 'react'
import Script from 'next/script'
import Providers from '@/lib/providers'
import UcConsentBridge from '@/components/consent/uc-consent-bridge'

type RootLayoutProps = PageParamsProps & PropsWithChildren

const GA_MEASUREMENT_ID = 'G-Q4R0BMBRQY'

// Google Consent Mode v2 defaults — denied until the Usercentrics CMP emits an update.
// Must run synchronously in <head> before any tag fires, so GA4 and any future
// ad tag respect EU consent (Provv. Garante 10/06/2021, EDPB Guidelines 2/2023).
const consentDefaultScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 2000,
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', false);
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
`

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { lang } = await params
  return (
    <html lang={lang}>
      <head>
        <script id="consent-default" dangerouslySetInnerHTML={{ __html: consentDefaultScript }} />
        <Script
          id="usercentrics-cmp"
          src="/uc-cmp/ui/loader.js"
          data-settings-id="5kW_lfUnkcT6Kp"
          strategy="beforeInteractive"
          async
        />
        <Script
          id="gtag-src"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
          async
        />
      </head>
      <body className={`antialiased`}>
        <UcConsentBridge />
        <Providers params={params}>{children}</Providers>
      </body>
    </html>
  )
}
