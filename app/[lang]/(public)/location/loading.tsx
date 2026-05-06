import { Skeleton } from '@/components/ui/skeleton'

function LocationCardSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="mt-2 space-y-1.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <LocationCardSkeleton key={i} />
        ))}
      </div>
    </main>
  )
}
