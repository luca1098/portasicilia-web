import { useState } from 'react'
import { useAction } from '@/lib/hooks/use-action'
import type { ActionResult } from '@/lib/actions/action.types'

type PaginatedResult<T> = {
  data: T[]
  nextCursor: string | null
}

export function usePaginatedList<T>(initialItems: T[], initialCursor: string | null) {
  const [items, setItems] = useState(initialItems)
  const [nextCursor, setNextCursor] = useState(initialCursor)

  const { loading: filtering, execute: executeFilter } = useAction<PaginatedResult<T>>({
    onSuccess: data => {
      if (data) {
        setItems(data.data)
        setNextCursor(data.nextCursor)
      }
    },
  })

  const { loading: loadingMore, execute: executeLoadMore } = useAction<PaginatedResult<T>>({
    onSuccess: data => {
      if (data) {
        setItems(prev => [...prev, ...data.data])
        setNextCursor(data.nextCursor)
      }
    },
  })

  function filter(action: () => Promise<ActionResult<PaginatedResult<T>>>) {
    executeFilter(() => action())
  }

  function loadMore(action: () => Promise<ActionResult<PaginatedResult<T>>>) {
    if (!nextCursor) return
    executeLoadMore(() => action())
  }

  return { items, nextCursor, filtering, filter, loadingMore, loadMore }
}
