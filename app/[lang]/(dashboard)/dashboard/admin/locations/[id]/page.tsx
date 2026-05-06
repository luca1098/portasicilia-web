import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { getLocalityById } from '@/lib/api/localities'
import LocalityForm from '@/components/dashboard/localities/locality-form'
import TipList from '@/components/dashboard/localities/tip-list'
import Link from 'next/link'
import { ArrowLeft } from '@/lib/constants/icons'

type EditLocalityPageProps = {
  params: Promise<{ lang: string; id: string }>
}

export default async function EditLocalityPage({ params }: EditLocalityPageProps) {
  const { lang, id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)

  let locality
  try {
    locality = await getLocalityById(id)
  } catch {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href={`/${lang}/dashboard/admin/locations`}
          className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.admin_loc_edit}</h1>
        </div>
      </div>

      <LocalityForm mode="edit" locality={locality} />

      <TipList localityId={locality.id} tips={locality.tips ?? []} />
    </div>
  )
}
