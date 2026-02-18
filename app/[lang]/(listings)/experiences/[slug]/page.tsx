import { notFound } from 'next/navigation'
import { getExperienceBySlug } from '@/lib/api/experiences'
import { ApiError } from '@/lib/api/fetch-client'
import ExperienceDetailContent from '@/components/experience/detail/experience-detail-content'

type ExperienceDetailPageProps = {
  params: Promise<{ lang: string; slug: string }>
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { lang, slug } = await params

  let experience
  try {
    experience = await getExperienceBySlug(slug)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound()
    }
    throw error
  }

  return <ExperienceDetailContent experience={experience} lang={lang} />
}
