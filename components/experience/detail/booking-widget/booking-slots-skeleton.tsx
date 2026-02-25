import { Skeleton } from '@/components/ui/skeleton'

export default function BookingSlotsSkeleton() {
  return (
    <div className="space-y-6">
      {[0, 1].map(group => (
        <div key={group}>
          <Skeleton className="mb-1 h-5 w-32" />
          <Skeleton className="mb-4 h-3 w-24" />
          <Skeleton className="mb-2 h-4 w-48" />
          <div className="space-y-2">
            {[0, 1, 2].map(i => (
              <Skeleton key={i} className="h-[68px] rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
