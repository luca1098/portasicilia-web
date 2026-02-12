import { useState, useCallback, useMemo } from 'react'
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

type SortableItem = { id: string; order: number }

export function useSortableList<T extends SortableItem>(initialItems: T[]) {
  const [localItems, setLocalItems] = useState(initialItems)
  const [orderedItems, setOrderedItems] = useState<T[] | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sorted = useMemo(() => [...localItems].sort((a, b) => a.order - b.order), [localItems])
  const displayItems = orderedItems ?? sorted

  const hasChanges = orderedItems !== null && orderedItems.some((item, i) => item.id !== sorted[i]?.id)

  const activeItem = activeId ? (displayItems.find(item => item.id === activeId) ?? null) : null

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null)
      const { active, over } = event
      if (!over || active.id === over.id) return

      const currentItems = orderedItems ?? sorted
      const oldIndex = currentItems.findIndex(item => item.id === active.id)
      const newIndex = currentItems.findIndex(item => item.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return

      const reordered = [...currentItems]
      const [moved] = reordered.splice(oldIndex, 1)
      reordered.splice(newIndex, 0, moved)

      const withUpdatedOrder = reordered.map((item, i) => ({ ...item, order: i + 1 }))
      setOrderedItems(withUpdatedOrder)
    },
    [orderedItems, sorted]
  )

  const addItem = useCallback((newItem: T) => {
    setLocalItems(prev => [...prev, newItem])
    setOrderedItems(null)
  }, [])

  const updateItem = useCallback((updatedItem: T) => {
    setLocalItems(prev => prev.map(item => (item.id === updatedItem.id ? updatedItem : item)))
    setOrderedItems(null)
  }, [])

  const removeItem = useCallback((deletedId: string) => {
    setLocalItems(prev => prev.filter(item => item.id !== deletedId))
    setOrderedItems(null)
  }, [])

  const getReorderPayload = useCallback(() => {
    if (!orderedItems) return null
    return orderedItems.map((item, i) => ({ id: item.id, order: i + 1 }))
  }, [orderedItems])

  return {
    displayItems,
    hasChanges,
    activeItem,
    sensors,
    handleDragStart,
    handleDragEnd,
    addItem,
    updateItem,
    removeItem,
    getReorderPayload,
  }
}
