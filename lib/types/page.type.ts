export type PageParamsProps = {
  params: Promise<{ lang: string }>
}

export type PageSearchParamsProps = {
  searchParams: Promise<Record<string, string | undefined>>
}
