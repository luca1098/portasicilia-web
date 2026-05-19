import Link from 'next/link'
import { formatDate } from '@/lib/utils/format.utils'
import type { PartnerApplicationDetail as TDetail } from '@/lib/types/partner-application.type'
import AdminApplicationActions from './admin-application-actions'

type Translations = Awaited<ReturnType<typeof import('@/lib/configs/locales/i18n').getTranslations>>

type Props = { application: TDetail; lang: string; t: Translations }

export default function AdminApplicationDetail({ application: a, lang, t }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</div>

          <Section title={t.partner_form_business_section}>
            <Field label={t.partner_form_business_name} value={a.businessName} />
            <Field label={t.partner_form_vat_number} value={a.vatNumber ?? '—'} />
            <Field
              label={t.partner_form_website}
              value={
                a.website ? (
                  <a
                    href={a.website}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    {a.website}
                  </a>
                ) : (
                  '—'
                )
              }
            />
          </Section>

          <Section title={t.partner_form_contact_section}>
            <Field label={t.partner_form_first_name} value={a.firstName} />
            <Field label={t.partner_form_last_name} value={a.lastName} />
            <Field label={t.partner_form_email} value={a.email} />
            <Field label={t.partner_form_phone} value={a.phone} />
            <Field label={t.partner_form_role_label} value={a.role ?? '—'} />
          </Section>

          <Section title={t.partner_form_details_section}>
            <Field label={t.partner_form_locality} value={a.locality} />
            <Field label={t.partner_form_description} value={a.description} />
            <Field label={t.partner_form_pitch} value={a.pitch} />
          </Section>

          <Section title={t.partner_form_socials_section}>
            <Field
              label="Instagram"
              value={
                a.instagramUrl ? (
                  <a
                    href={a.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    {a.instagramUrl}
                  </a>
                ) : (
                  '—'
                )
              }
            />
            <Field
              label="Facebook"
              value={
                a.facebookUrl ? (
                  <a
                    href={a.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    {a.facebookUrl}
                  </a>
                ) : (
                  '—'
                )
              }
            />
            <Field
              label="TikTok"
              value={
                a.tiktokUrl ? (
                  <a
                    href={a.tiktokUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    {a.tiktokUrl}
                  </a>
                ) : (
                  '—'
                )
              }
            />
          </Section>

          {a.createdOwner && (
            <Section title={t.partner_admin_created_owner}>
              <Link
                href={`/${lang}/dashboard/admin/owners/${a.createdOwner.id}`}
                className="text-primary underline-offset-2 hover:underline text-sm"
              >
                {a.createdOwner.email}
              </Link>
            </Section>
          )}
        </div>
      </div>

      <aside>
        <AdminApplicationActions application={a} />
      </aside>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="border-b pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <dl className="mt-3 space-y-2">{children}</dl>
    </section>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2">{value}</dd>
    </div>
  )
}
