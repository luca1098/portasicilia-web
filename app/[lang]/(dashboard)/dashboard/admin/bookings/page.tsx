import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getAdminBookings } from '@/lib/api/bookings'
import BookingsTable from '@/components/dashboard/bookings/bookings-table'

export default async function BookingsPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }
  const result = await getAdminBookings(headers, { status: 'CONFIRMED' })

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.admin_bookings_title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.admin_bookings_subtitle}</p>
      </div>

      <BookingsTable bookings={result.data} />
    </div>
  )
}
