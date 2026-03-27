import { redirect, notFound } from 'next/navigation'
import { getReviewTokenInfoServer } from '@/lib/api/reviews'
import ReviewContent from '@/components/review/review-content'
import type { PageParamsProps, PageSearchParamsProps } from '@/lib/types/page.type'

type ReviewPageProps = PageParamsProps &
  PageSearchParamsProps & {
    params: Promise<{ lang: string; slug: string }>
  }

export default async function ReviewPage({ params, searchParams }: ReviewPageProps) {
  const [{ lang }, sp] = await Promise.all([params, searchParams])
  const token = sp['token']

  if (!token) {
    redirect(`/${lang}`)
  }

  let listingInfo
  try {
    listingInfo = await getReviewTokenInfoServer(token)
  } catch {
    notFound()
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <ReviewContent token={token} listingInfo={listingInfo} />
      </div>
    </main>
  )
}
