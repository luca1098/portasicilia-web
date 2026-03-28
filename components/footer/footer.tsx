'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Facebook, Instagram, TikTokIcon } from '@/lib/constants/icons'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { InputFormField } from '@/components/form/input-form-field'
import { useTranslation } from '@/lib/context/translation.context'
import React, { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api/fetch-client'
import type { Locality } from '@/lib/schemas/entities/locality.entity.schema'
import type { Category } from '@/lib/schemas/entities/category.entity.schema'
import type { StayCard } from '@/lib/api/stays'
import type { Article } from '@/lib/schemas/entities/article.entity.schema'

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
  icon: React.ComponentType<{ className?: string }>
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

const PAYMENT_METHODS = [
  { name: 'PayPal', src: '/images/payments/paypal.svg' },
  { name: 'Mastercard', src: '/images/payments/mastercard.svg' },
  { name: 'Visa', src: '/images/payments/visa.svg' },
  { name: 'Apple Pay', src: '/images/payments/apple-pay.svg' },
  { name: 'Google Pay', src: '/images/payments/google-pay.png' },
  { name: 'Klarna', src: '/images/payments/klarna.png' },
]

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

  const onSubmit = (_data: NewsletterFormValues) => {
    // TODO: implement newsletter subscription
  }

  const [localities, setLocalities] = useState<Locality[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stays, setStays] = useState<StayCard[]>([])
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    api
      .get<Locality[]>('/localities', { params: { limit: 6 } })
      .then(setLocalities)
      .catch(() => {})
    api
      .get<Category[]>('/categories', {
        ...(lang && lang !== 'it' && { lang: lang as 'en' }),
      })
      .then(data => setCategories(data.slice(0, 6)))
      .catch(() => {})
    api
      .get<{ data: StayCard[]; nextCursor: string | null }>('/stays/cards', { params: { limit: 6 } })
      .then(res => setStays(res.data))
      .catch(() => {})
    api
      .get<Article[]>('/blog/articles/recent', { params: { limit: 6 } })
      .then(setArticles)
      .catch(() => {})
  }, [lang])

  const destinazioniLinks = [
    ...localities.map(l => ({ label: l.name, href: `/location/${l.slug}` })),
    { label: t.footer_discover_more, href: '/location' },
  ]

  const ispirazioneLinks = [
    ...categories.map(c => ({ label: c.name, href: `/category/${c.slug}` })),
    { label: t.footer_discover_more, href: '/categories' },
  ]

  const alloggiLinks = [
    ...stays.map(s => ({ label: s.name, href: `/stays/${s.slug}` })),
    { label: t.footer_discover_more, href: '/stays' },
  ]

  const pilloleLinks = [
    ...articles.map(a => ({ label: a.title, href: `/blog/${a.slug}` })),
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
          <Image
            src="/logo-white.png"
            alt="Porta Sicilia — Truly Sicilian Experience"
            width={200}
            height={100}
          />

          {/* Newsletter Form */}
          <div className="flex flex-col items-center gap-2">
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full max-w-2xl items-start justify-between gap-2"
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
                  className="h-14 shrink-0 rounded-xl bg-primary px-6 text-sm font-medium text-white hover:bg-primary/90"
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
            <SocialButton
              icon={Facebook}
              href="https://www.facebook.com/p/Porta-Sicilia-61575665175756/"
              label="Facebook"
            />
            <SocialButton
              icon={Instagram}
              href="https://www.instagram.com/porta_sicilia/"
              label="Instagram"
            />
            <SocialButton icon={TikTokIcon} href="https://www.tiktok.com/@porta_sicilia" label="TikTok" />
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
            {PAYMENT_METHODS.map(pm => (
              <div key={pm.name} className="flex h-8 w-12 items-center justify-center rounded bg-white p-1">
                <Image
                  src={pm.src}
                  alt={pm.name}
                  width={38}
                  height={24}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
