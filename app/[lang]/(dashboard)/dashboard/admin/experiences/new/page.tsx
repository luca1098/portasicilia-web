import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getLocalities } from '@/lib/api/localities'
import { getCategories } from '@/lib/api/categories'
import ExperienceWizard from '@/components/dashboard/experiences/wizard/experience-wizard'
import Link from 'next/link'
import { ArrowLeft } from '@/lib/constants/icons'

export default async function NewExperiencePage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/${lang}`)
  }

  const [t, localities, categories] = await Promise.all([
    getTranslations(lang as SupportedLocale),
    getLocalities(),
    getCategories('EXPERIENCE'),
  ])

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
          <h1 className="text-2xl font-bold tracking-tight">{t.admin_exp_add}</h1>
        </div>
      </div>

      <ExperienceWizard mode="create" localities={localities} categories={categories} />
    </div>
  )
}
