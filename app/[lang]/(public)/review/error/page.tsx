import { AlertCircleIcon } from '@/lib/constants/icons'
import { getTranslations } from '@/lib/configs/locales/i18n'
import type { SupportedLocale } from '@/lib/configs/locales'
import type { PageParamsProps, PageSearchParamsProps } from '@/lib/types/page.type'

type ReviewErrorPageProps = PageParamsProps & PageSearchParamsProps

function getErrorMessage(
  reason: string | undefined,
  t: {
    review_error_expired: string
    review_error_already_submitted: string
    review_error_invalid: string
  }
): string {
  if (reason === 'expired') return t.review_error_expired
  if (reason === 'already_submitted') return t.review_error_already_submitted
  return t.review_error_invalid
}

export default async function ReviewErrorPage({ params, searchParams }: ReviewErrorPageProps) {
  const [{ lang }, sp] = await Promise.all([params, searchParams])
  const t = await getTranslations(lang as SupportedLocale)
  const reason = sp['reason']

  const message = getErrorMessage(reason, t)

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <AlertCircleIcon className="size-16 text-destructive" />
          <h1 className="text-2xl font-bold">{t.review_error_title}</h1>
          <p className="max-w-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </main>
  )
}
