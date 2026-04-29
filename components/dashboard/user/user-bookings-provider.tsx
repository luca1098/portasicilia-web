'use client'

import { createContext, use, useState, useMemo } from 'react'
import type { UserBooking } from '@/lib/api/user-bookings'
import type { UserOrder } from '@/lib/api/user-orders'

const REQUEST_STATUSES = ['PENDING_APPROVAL', 'COUNTER_PROPOSED', 'REJECTED']
const BOOKING_STATUSES = ['CONFIRMED', 'COMPLETED']

type UserBookingsState = {
  bookings: UserBooking[]
  requestFilter: string
  requests: UserBooking[]
  confirmedBookings: UserBooking[]
  filteredRequests: UserBooking[]
  counterProposedCount: number
  orders: UserOrder[]
}

type UserBookingsActions = {
  setRequestFilter: (filter: string) => void
  handleStatusChange: (bookingId: string, newStatus: string) => void
  markReviewed: (bookingId: string) => void
  updateOrder: (order: UserOrder) => void
}

type UserBookingsContextValue = {
  state: UserBookingsState
  actions: UserBookingsActions
}

const UserBookingsContext = createContext<UserBookingsContextValue | null>(null)

export function useUserBookings() {
  const ctx = use(UserBookingsContext)
  if (!ctx) throw new Error('useUserBookings must be used within UserBookingsProvider')
  return ctx
}

export default function UserBookingsProvider({
  initialBookings,
  initialOrders,
  children,
}: {
  initialBookings: UserBooking[]
  initialOrders: UserOrder[]
  children: React.ReactNode
}) {
  const [bookings, setBookings] = useState(initialBookings)
  const [orders, setOrders] = useState(initialOrders)
  const [requestFilter, setRequestFilter] = useState('ALL')

  const state = useMemo(() => {
    const requests = bookings.filter(b => REQUEST_STATUSES.includes(b.status))
    const confirmedBookings = bookings.filter(b => BOOKING_STATUSES.includes(b.status))
    const counterProposedCount = requests.filter(b => b.status === 'COUNTER_PROPOSED').length
    const filteredRequests =
      requestFilter === 'ALL' ? requests : requests.filter(b => b.status === requestFilter)

    return {
      bookings,
      requestFilter,
      requests,
      confirmedBookings,
      filteredRequests,
      counterProposedCount,
      orders,
    }
  }, [bookings, requestFilter, orders])

  const actions = useMemo<UserBookingsActions>(
    () => ({
      setRequestFilter,
      handleStatusChange: (bookingId: string, newStatus: string) => {
        setBookings(prev => prev.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b)))
      },
      markReviewed: (bookingId: string) => {
        setBookings(prev => prev.map(b => (b.id === bookingId ? { ...b, hasReview: true } : b)))
      },
      updateOrder: (order: UserOrder) => {
        setOrders(prev => prev.map(o => (o.id === order.id ? order : o)))
      },
    }),
    []
  )

  return <UserBookingsContext value={{ state, actions }}>{children}</UserBookingsContext>
}
