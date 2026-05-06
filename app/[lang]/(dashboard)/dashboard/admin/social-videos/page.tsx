import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getSocialVideosAdmin } from '@/lib/api/social-videos'
import type { SocialVideo } from '@/lib/schemas/entities/social-video.entity.schema'
import SocialVideoList from '@/components/dashboard/social-videos/social-video-list'
import { DashboardListPage } from '@/components/dashboard/dashboard-page'

export default async function SocialVideosPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }
  const videos: SocialVideo[] = await getSocialVideosAdmin(headers).catch(() => [])

  return (
    <DashboardListPage>
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.admin_social_videos_title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
            {t.admin_social_videos_subtitle}
          </p>
        </div>
      </div>

      <SocialVideoList videos={videos} />
    </DashboardListPage>
  )
}
