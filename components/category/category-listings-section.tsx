'use client'

type CategoryListingsSectionProps = {
  title: string
  children: React.ReactNode
}

export default function CategoryListingsSection({ title, children }: CategoryListingsSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
      <h2 className="mb-6 text-xl font-semibold">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">{children}</div>
    </section>
  )
}
