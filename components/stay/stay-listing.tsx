'use client'

import { useState } from 'react'
import type { StayCard } from '@/lib/api/stays'
import { api } from '@/lib/api/fetch-client'
import { useAction } from '@/lib/hooks/use-action'
import { useTranslation } from '@/lib/context/translation.context'
import { Button } from '@/components/ui/button'
import { LoaderIcon } from '@/lib/constants/icons'
import StayGrid from '@/components/stay/stay-grid'

type PaginatedStayCards = {
  data: StayCard[]
  nextCursor: string | null
}

type StayListingProps = {
  initialStays: StayCard[]
  initialCursor: string | null
  limit: number
  lang: string
  localityId?: string
}

export default function StayListing({
  initialStays,
  initialCursor,
  limit,
  lang,
  localityId,
}: StayListingProps) {
  const t = useTranslation()
  const [stays, setStays] = useState(initialStays)
  const [cursor, setCursor] = useState(initialCursor)

  const { loading, execute } = useAction<PaginatedStayCards>({
    onSuccess: data => {
      if (!data) return
      setStays(prev => [...prev, ...data.data])
      setCursor(data.nextCursor)
    },
  })

  const loadMore = () =>
    execute(async () => {
      const params: Record<string, string> = { limit: limit.toString() }
      if (localityId) params.localityId = localityId
      if (cursor) params.cursor = cursor
      const data = await api.get<PaginatedStayCards>('/stays/cards', { params })
      return { success: true, data }
    })

  return (
    <>
      <StayGrid stays={stays} lang={lang} />
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
