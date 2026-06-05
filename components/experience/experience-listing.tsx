'use client'

import { useState } from 'react'
import type { ExperienceCard } from '@/lib/api/experiences'
import { api } from '@/lib/api/fetch-client'
import { useAction } from '@/lib/hooks/use-action'
import { useTranslation } from '@/lib/context/translation.context'
import { Button } from '@/components/ui/button'
import { LoaderIcon } from '@/lib/constants/icons'
import ExperienceCardGrid from '@/components/experience/experience-card-grid'

type PaginatedExperienceCards = {
  data: ExperienceCard[]
  nextCursor: string | null
}

type ExperienceListingProps = {
  initialExperiences: ExperienceCard[]
  initialCursor: string | null
  limit: number
  lang: string
  localityId?: string
}

export default function ExperienceListing({
  initialExperiences,
  initialCursor,
  limit,
  lang,
  localityId,
}: ExperienceListingProps) {
  const t = useTranslation()
  const [experiences, setExperiences] = useState(initialExperiences)
  const [cursor, setCursor] = useState(initialCursor)

  const { loading, execute } = useAction<PaginatedExperienceCards>({
    onSuccess: data => {
      if (!data) return
      setExperiences(prev => [...prev, ...data.data])
      setCursor(data.nextCursor)
    },
  })

  const loadMore = () =>
    execute(async () => {
      const params: Record<string, string> = { limit: limit.toString() }
      if (localityId) params.localityId = localityId
      if (cursor) params.cursor = cursor
      const data = await api.get<PaginatedExperienceCards>('/experiences/cards', { params })
      return { success: true, data }
    })

  return (
    <>
      <ExperienceCardGrid experiences={experiences} lang={lang} />
      {cursor && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={loadMore} disabled={loading}>
            {loading && <LoaderIcon className="animate-spin" />}
            {t.listing_load_more}
          </Button>
        </div>
      )}
    </>
  )
}
