import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { getExperienceById } from '@/lib/api/experiences'
import { getPriceListsByExperienceId } from '@/lib/api/pricing'
import { getLocalities } from '@/lib/api/localities'
import ExperienceTabs from '@/components/dashboard/experiences/experience-tabs'
import Link from 'next/link'
import { ArrowLeft } from '@/lib/constants/icons'

type EditExperiencePageProps = {
  params: Promise<{ lang: string; id: string }>
}

export default async function EditExperiencePage({ params }: EditExperiencePageProps) {
  const { lang, id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)

  let experience
  try {
    experience = await getExperienceById(id)
  } catch {
    notFound()
  }

  const localities = await getLocalities()

  let priceLists: Awaited<ReturnType<typeof getPriceListsByExperienceId>>
  try {
    priceLists = await getPriceListsByExperienceId(id)
  } catch {
    priceLists = []
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href={`/${lang}/dashboard/admin/experiences`}
          className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.admin_exp_edit}</h1>
        </div>
      </div>

      <ExperienceTabs experience={experience} localities={localities} priceLists={priceLists} />
    </div>
  )
}
