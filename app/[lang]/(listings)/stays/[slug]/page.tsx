import { notFound } from 'next/navigation'
import { getStayBySlug } from '@/lib/api/stays'
import { ApiError } from '@/lib/api/fetch-client'
import StayDetailContent from '@/components/stay/detail/stay-detail-content'

export const dynamic = 'force-dynamic'

type StayDetailPageProps = {
  params: Promise<{ lang: string; slug: string }>
}

export default async function StayDetailPage({ params }: StayDetailPageProps) {
  const { lang, slug } = await params

  let stay
  try {
    stay = await getStayBySlug(slug)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound()
    }
    throw error
  }

  return <StayDetailContent stay={stay} lang={lang} />
}
