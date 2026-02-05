'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { InputFormField } from '@/components/form/input-form-field'
import { useTranslation } from '@/lib/context/translation.context'
import { ReactNode, useMemo } from 'react'

interface NewsletterFormValues {
  email: string
}

const FooterLinkColumn = ({
  title,
  links,
  lang,
}: {
  title: string
  links: { label: string; href: string }[]
  lang: string
}) => (
  <div className="flex flex-col gap-4">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <ul className="flex flex-col gap-2">
      {links.map((link, index) => (
        <li key={index}>
          <Link
            href={`/${lang}${link.href}`}
            className="text-sm text-primary transition-colors hover:text-primary/80"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

const SocialButton = ({
  icon: Icon,
  href,
  label,
}: {
  icon: typeof Facebook
  href: string
  label: string
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex size-12 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/80"
  >
    <Icon className="size-5" />
  </a>
)

const PaymentIcon = ({ name }: { name: string }) => {
  const icons: Record<string, ReactNode> = {
    paypal: (
      <svg viewBox="0 0 38 24" className="h-6 w-auto" fill="none">
        <rect width="38" height="24" rx="3" fill="white" />
        <path
          d="M10.5 7.5h2.8c1.7 0 2.5.8 2.4 2.1-.2 2.2-1.6 3.4-3.5 3.4h-.7c-.3 0-.5.2-.5.4l-.4 2.6c0 .1-.1.2-.3.2h-1.5c-.2 0-.3-.1-.3-.3l1.2-8.1c0-.2.2-.3.4-.3z"
          fill="#003087"
        />
        <path
          d="M23.5 7.3c.8 0 1.7.2 2.2.7.4.4.5 1 .4 1.7-.3 2.2-1.4 3.4-3.5 3.4h-1c-.2 0-.4.2-.4.4l-.3 2.3c0 .1-.1.2-.2.2h-1.2c-.1 0-.2-.1-.2-.2l.1-.6 1-6.3v-.2c0-.8.6-1.4 1.4-1.4h1.7z"
          fill="#009cde"
        />
      </svg>
    ),
    mastercard: (
      <svg viewBox="0 0 38 24" className="h-6 w-auto" fill="none">
        <rect width="38" height="24" rx="3" fill="white" />
        <circle cx="15" cy="12" r="6" fill="#EB001B" />
        <circle cx="23" cy="12" r="6" fill="#F79E1B" />
        <path d="M19 7.5a6 6 0 0 0 0 9 6 6 0 0 0 0-9z" fill="#FF5F00" />
      </svg>
    ),
    visa: (
      <svg viewBox="0 0 38 24" className="h-6 w-auto" fill="none">
        <rect width="38" height="24" rx="3" fill="white" />
        <path
          d="M15.5 16h-2l1.3-8h2l-1.3 8zm7.2-8l-1.9 5.5-.2-1.1-.7-3.6s-.1-.8-.9-.8h-3.1l-.1.3s1 .2 2.1.9l1.8 6.8h2.1l3.2-8h-2.3zm5.8 5.5c0-.4.4-.8 1.3-.9.4 0 1 0 1.9.4l.3-1.8s-.9-.3-1.9-.3c-2 0-3.4 1-3.4 2.5 0 1.1 1 1.7 1.8 2 .8.4 1.1.6 1.1 1 0 .5-.7.8-1.3.8-.9 0-1.4-.1-2.1-.5l-.3 1.8c.5.2 1.4.4 2.4.4 2.1 0 3.5-1 3.5-2.6 0-2-2.8-2.1-2.8-2.8h-.5z"
          fill="#1A1F71"
        />
      </svg>
    ),
    gpay: (
      <svg viewBox="0 0 38 24" className="h-6 w-auto" fill="none">
        <rect width="38" height="24" rx="3" fill="white" />
        <path
          d="M18.4 12.4v3h-1V8h2.6c.6 0 1.2.2 1.6.6.5.4.7.9.7 1.5s-.2 1.1-.7 1.5c-.4.4-1 .6-1.6.6h-1.6v.2zm0-3.4v2.4h1.7c.4 0 .7-.1.9-.4.3-.2.4-.5.4-.8s-.1-.6-.4-.8c-.2-.3-.5-.4-.9-.4h-1.7z"
          fill="#5F6368"
        />
        <path
          d="M25.2 10.4c.7 0 1.3.2 1.7.6.4.4.6 1 .6 1.7v2.8h-1v-.6c-.3.5-.8.7-1.5.7-.4 0-.8-.1-1.1-.3-.3-.2-.5-.4-.6-.7-.1-.3-.2-.5-.2-.8 0-.5.2-.9.5-1.2.4-.3.9-.4 1.5-.4.5 0 .9.1 1.2.3v-.1c0-.4-.1-.6-.3-.8-.2-.2-.5-.3-.9-.3-.5 0-1 .2-1.3.5l-.4-.8c.5-.4 1.1-.6 1.8-.6zm-.6 4c.3.2.6.2 1 .2.3 0 .5-.1.7-.2.2-.2.3-.4.3-.6 0-.3-.1-.5-.3-.6-.2-.2-.5-.2-.8-.2-.3 0-.6.1-.8.2-.2.2-.3.4-.3.6 0 .2.1.4.2.6z"
          fill="#5F6368"
        />
        <path d="M32 10.5l-2.4 5.5h-1.1l.9-1.9-1.6-3.6h1.1l1 2.5 1-2.5H32z" fill="#5F6368" />
        <path
          d="M13.9 11.8c0-.2 0-.4-.1-.6h-3.1v1.2h1.8c-.1.4-.3.8-.7 1v.9h1.1c.7-.6 1-1.5 1-2.5z"
          fill="#4285F4"
        />
        <path
          d="M10.7 15.2c.9 0 1.7-.3 2.3-.8l-1.1-.9c-.3.2-.7.3-1.2.3-.9 0-1.7-.6-2-1.5h-1.1v.9c.6 1.2 1.8 2 3.1 2z"
          fill="#34A853"
        />
        <path
          d="M8.7 12.3c-.1-.3-.1-.5-.1-.8 0-.3 0-.5.1-.8v-.9H7.6c-.2.5-.4 1.1-.4 1.7 0 .6.1 1.2.4 1.7l1.1-.9z"
          fill="#FBBC04"
        />
        <path
          d="M10.7 9.2c.5 0 1 .2 1.3.5l1-.9c-.6-.6-1.4-.9-2.3-.9-1.3 0-2.5.8-3.1 2l1.1.9c.3-.9 1.1-1.6 2-1.6z"
          fill="#EA4335"
        />
      </svg>
    ),
    applepay: (
      <svg viewBox="0 0 38 24" className="h-6 w-auto" fill="none">
        <rect width="38" height="24" rx="3" fill="white" />
        <path
          d="M11.2 9.3c-.3.4-.8.7-1.2.6-.1-.5.2-.9.4-1.2.3-.4.8-.6 1.2-.6.1.4-.1.9-.4 1.2zm.4.7c-.7 0-1.2.4-1.6.4-.4 0-.9-.4-1.5-.4-.8 0-1.5.4-1.9 1.1-.8 1.4-.2 3.5.6 4.6.4.6.8 1.2 1.5 1.2.6 0 .8-.4 1.5-.4.7 0 .9.4 1.5.4.6 0 1-.5 1.4-1.1.4-.6.6-1.2.6-1.3-.1-.1-1.2-.5-1.2-1.8 0-1.1.9-1.7 1-1.7-.5-.8-1.4-.9-1.6-.9-.6 0-1.1.3-1.4.3h.1v-.4zm6.2-.4c1.3 0 2.3.9 2.3 2.2 0 1.3-1 2.2-2.4 2.2h-1.5v2.3h-1.1V9.6h2.7zm-1.6 3.5h1.3c.9 0 1.4-.5 1.4-1.3 0-.8-.5-1.3-1.4-1.3h-1.3v2.6zm4.3 1.5c0-.8.6-1.3 1.8-1.4l1.3-.1v-.4c0-.5-.3-.8-1-.8-.5 0-.9.2-1 .6h-1c.1-.9.9-1.5 2-1.5 1.2 0 2 .6 2 1.6v3.3h-1v-.7c-.3.5-.9.8-1.5.8-.9 0-1.6-.6-1.6-1.4zm3.1-.4v-.4l-1.2.1c-.6 0-.9.2-.9.6 0 .4.4.6.8.6.6 0 1.3-.4 1.3-1h0v.1zm2.1 2.4v-.8c.1 0 .3.1.5.1.4 0 .6-.2.8-.6l.1-.2-1.8-5h1.2l1.2 4h0l1.2-4h1.1l-1.9 5.3c-.4 1.1-.9 1.5-1.8 1.5-.2 0-.4 0-.6-.1v-.2z"
          fill="#000"
        />
      </svg>
    ),
  }

  return (
    <div className="flex h-8 w-12 items-center justify-center rounded bg-white px-1">
      {icons[name] || <span className="text-xs">{name}</span>}
    </div>
  )
}

export default function Footer() {
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation()

  const newsletterSchema = useMemo(
    () =>
      z.object({
        email: z.string().min(1, t.footer_email_required).email(t.footer_email_invalid),
      }),
    [t]
  )

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (data: NewsletterFormValues) => {
    // eslint-disable-next-line no-console
    console.log('Newsletter subscription:', data.email)
  }

  const destinazioniLinks = [
    { label: t.footer_dest_cefalu, href: '/location/cefalu' },
    { label: t.footer_dest_palermo, href: '/location/palermo' },
    { label: t.footer_dest_capo_orlando, href: '/location/capo-orlando' },
    { label: t.footer_dest_noto, href: '/location/noto' },
    { label: t.footer_discover_more, href: '/location' },
  ]

  const ispirazioneLinks = [
    { label: t.footer_insp_romantic, href: '/category/fuga-romantica' },
    { label: t.footer_insp_nature, href: '/category/immerso-nella-natura' },
    { label: t.footer_insp_sea, href: '/category/profumo-di-mare' },
    { label: t.footer_insp_city, href: '/category/nel-cuore-della-citta' },
    { label: t.footer_insp_madonie, href: '/category/madonie-segrete' },
    { label: t.footer_discover_more, href: '/category' },
  ]

  const alloggiLinks = [
    { label: t.footer_insp_romantic, href: '/stays?category=romantic' },
    { label: t.footer_insp_nature, href: '/stays?category=nature' },
    { label: t.footer_insp_sea, href: '/stays?category=sea' },
    { label: t.footer_insp_city, href: '/stays?category=city' },
    { label: t.footer_insp_madonie, href: '/stays?category=madonie' },
    { label: t.footer_discover_more, href: '/stays' },
  ]

  const pilloleLinks = [
    { label: t.footer_pill_beaches, href: '/blog/spiagge-sicilia' },
    { label: t.footer_pill_pistachio, href: '/blog/menu-pistacchio' },
    { label: t.footer_pill_boat_tours, href: '/blog/tour-barca' },
    { label: t.footer_discover_more, href: '/blog' },
  ]

  const linkUtiliLinks = [
    { label: t.footer_privacy_policy, href: '/privacy-policy' },
    { label: t.footer_cookie_policy, href: '/cookie-policy' },
    { label: t.footer_terms, href: '/terms' },
    { label: 'FAQ', href: '/faq' },
    { label: t.footer_cancellation, href: '/cancellation-policy' },
    { label: t.footer_become_partner, href: '/partner' },
  ]

  return (
    <footer className="bg-[#0a1628]">
      {/* Newsletter Section */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex size-16 items-center justify-center rounded-lg border-2 border-primary bg-transparent">
              <svg
                viewBox="0 0 24 24"
                className="size-10 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 21V8a2 2 0 012-2h14a2 2 0 012 2v13" />
                <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" />
                <path d="M7 21v-4a2 2 0 012-2h6a2 2 0 012 2v4" />
                <rect x="9" y="9" width="6" height="4" rx="1" />
              </svg>
            </div>
            <div className="hidden flex-col md:flex">
              <span className="text-2xl font-bold text-primary">Porta</span>
              <span className="text-2xl font-bold text-primary">Sicilia</span>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="flex flex-col items-center gap-2">
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full max-w-2xl items-start justify-between gap-1"
              >
                <InputFormField<NewsletterFormValues>
                  name="email"
                  label={t.footer_email_placeholder}
                  type="email"
                  required
                  className="flex-1"
                />
                <Button
                  type="submit"
                  className="shrink-0 bg-primary px-6 text-sm font-medium text-white hover:bg-primary/90"
                >
                  {t.footer_subscribe_button}
                </Button>
              </form>
            </FormProvider>
            <p className="max-w-lg text-center text-xs text-gray-400">
              {t.footer_privacy_notice}{' '}
              <Link href={`/${lang}/privacy-policy`} className="text-primary underline">
                {t.footer_privacy_policy}
              </Link>{' '}
              {t.footer_privacy_notice_and}{' '}
              <Link href={`/${lang}/terms`} className="text-primary underline">
                {t.footer_terms}
              </Link>
              {t.footer_privacy_notice_end}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <SocialButton icon={Facebook} href="https://facebook.com" label="Facebook" />
            <SocialButton icon={Instagram} href="https://instagram.com" label="Instagram" />
            <SocialButton icon={Twitter} href="https://twitter.com" label="Twitter" />
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            <FooterLinkColumn title={t.footer_destinations} links={destinazioniLinks} lang={lang} />
            <FooterLinkColumn title={t.footer_inspiration} links={ispirazioneLinks} lang={lang} />
            <FooterLinkColumn title={t.footer_stays} links={alloggiLinks} lang={lang} />
            <FooterLinkColumn title={t.footer_sicily_tips} links={pilloleLinks} lang={lang} />
            <FooterLinkColumn title={t.footer_useful_links} links={linkUtiliLinks} lang={lang} />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
          <p className="text-sm text-gray-400">{t.footer_copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <PaymentIcon name="paypal" />
            <PaymentIcon name="mastercard" />
            <PaymentIcon name="visa" />
            <PaymentIcon name="gpay" />
            <PaymentIcon name="applepay" />
          </div>
        </div>
      </div>
    </footer>
  )
}
