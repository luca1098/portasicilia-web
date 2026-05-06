import Link from 'next/link'
import { ChevronRightIcon } from '@/lib/constants/icons'
import JsonLd from '@/lib/seo/json-ld'
import { breadcrumbSchema } from '@/lib/seo/schema'

type BreadcrumbItem = {
  name: string
  url: string
  href: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(items.map(item => ({ name: item.name, url: item.url })))} />
      <nav aria-label="Breadcrumbs" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={item.url} className="flex items-center gap-1">
                {index > 0 && <ChevronRightIcon className="size-3.5" />}
                {isLast ? (
                  <span className="font-medium text-foreground">{item.name}</span>
                ) : (
                  <Link href={item.href} className="transition-colors hover:text-foreground">
                    {item.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
