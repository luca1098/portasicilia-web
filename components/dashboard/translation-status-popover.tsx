'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { api } from '@/lib/api/fetch-client'
import { CheckIcon, XIcon, LoaderIcon, LanguagesIcon } from '@/lib/constants/icons'

// ==================== TYPES ====================

type TranslationStatusKey = 'complete' | 'partial' | 'pending' | 'failed' | 'none'

type TranslationFieldStatus = {
  field: string
  status: 'completed' | 'none' | 'pending' | 'failed'
}

type TranslationItinerary = {
  id: string
  title: string
  fields: TranslationFieldStatus[]
}

type TranslationDetails = {
  listing: TranslationFieldStatus[]
  itineraries: TranslationItinerary[]
  stayDetail: TranslationFieldStatus[] | null
}

type FlatTranslationDetails = {
  fields: TranslationFieldStatus[]
}

type TranslationStatusValue = {
  status: TranslationStatusKey
  locales: Record<
    string,
    {
      status: TranslationStatusKey
      completed: number
      total: number
    }
  >
}

type RequestAuth = { headers?: HeadersInit }

type TranslationSource = {
  fetchDetails: (id: string, locale: string, auth: RequestAuth) => Promise<TranslationDetails>
  requestComplete: (id: string, locale: string | null, auth: RequestAuth) => Promise<void>
  sectionLabelKey: string
}

type TranslationStatusPopoverProps = {
  listingId: string
  source: TranslationSource
  status: TranslationStatusValue | undefined
  onTranslationComplete?: () => void
}

type VariantProps = Omit<TranslationStatusPopoverProps, 'source'>

// ==================== SOURCES ====================

const listingSource: TranslationSource = {
  fetchDetails: (id, locale, auth) =>
    api.get<TranslationDetails>(`/translations/listing/${id}/details?locale=${locale}`, auth),
  async requestComplete(id, locale, auth) {
    const qs = locale ? `?locale=${locale}` : ''
    await api.post(`/translations/listing/${id}/complete${qs}`, undefined, auth)
  },
  sectionLabelKey: 'admin_translation_listing_section',
}

function makeFlatSource(entity: 'category' | 'product', sectionLabelKey: string): TranslationSource {
  return {
    async fetchDetails(id, locale, auth) {
      const data = await api.get<FlatTranslationDetails>(
        `/translations/${entity}/${id}/details?locale=${locale}`,
        auth
      )
      return { listing: data.fields, itineraries: [], stayDetail: null }
    },
    async requestComplete(id, locale, auth) {
      const qs = locale ? `?locale=${locale}` : ''
      await api.post(`/translations/${entity}/${id}/complete${qs}`, undefined, auth)
    },
    sectionLabelKey,
  }
}

const categorySource = makeFlatSource('category', 'admin_translation_category_section')
const productSource = makeFlatSource('product', 'admin_translation_product_section')

// ==================== CONSTANTS ====================

const STATUS_CONFIG: Record<TranslationStatusKey, { bg: string; labelKey: string }> = {
  complete: { bg: 'bg-emerald-500/10 text-emerald-600', labelKey: 'admin_translation_complete' },
  partial: { bg: 'bg-amber-500/10 text-amber-600', labelKey: 'admin_translation_partial' },
  pending: { bg: 'bg-blue-500/10 text-blue-600', labelKey: 'admin_translation_pending' },
  failed: { bg: 'bg-red-500/10 text-red-600', labelKey: 'admin_translation_failed' },
  none: { bg: 'bg-muted text-muted-foreground', labelKey: 'admin_translation_none' },
}

// ==================== SUB-COMPONENTS ====================

function FieldRow({ field, status }: TranslationFieldStatus) {
  const t = useTranslation() as Record<string, string>
  const isDone = status === 'completed'
  const label = t[`admin_translation_field_${field}`] ?? field

  return (
    <div className="flex items-center justify-between gap-3 py-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {isDone ? (
        <CheckIcon className="size-3.5 shrink-0 text-emerald-500" />
      ) : (
        <XIcon className="size-3.5 shrink-0 text-red-400" />
      )}
    </div>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/60 first:mt-0">
      {children}
    </p>
  )
}

// ==================== MAIN COMPONENT ====================

function TranslationStatusPopover({
  listingId,
  source,
  status,
  onTranslationComplete,
}: TranslationStatusPopoverProps) {
  const [open, setOpen] = useState(false)
  const [activeLocale, setActiveLocale] = useState<string | null>(null)
  const [locales, setLocales] = useState<string[]>([])
  const [detailsCache, setDetailsCache] = useState<Record<string, TranslationDetails>>({})
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [fetchError, setFetchError] = useState(false)
  const [localStatus, setLocalStatus] = useState<TranslationStatusValue | undefined>(status)

  const { data: session } = useSession()
  const t = useTranslation() as Record<string, string>
  const authHeaders: RequestAuth = session?.accessToken
    ? { headers: { Authorization: `Bearer ${session.accessToken}` } }
    : {}

  const effectiveStatus = localStatus ?? status
  const resolvedStatus = effectiveStatus?.status ?? 'none'
  const { bg, labelKey } = STATUS_CONFIG[resolvedStatus]

  const activeDetails = activeLocale ? (detailsCache[activeLocale] ?? null) : null

  const hasMissing =
    activeDetails !== null &&
    (activeDetails.listing.some(f => f.status !== 'completed') ||
      activeDetails.itineraries.some(it => it.fields.some(f => f.status !== 'completed')) ||
      (activeDetails.stayDetail?.some(f => f.status !== 'completed') ?? false))

  const activeLocaleInfo =
    activeLocale && effectiveStatus?.locales?.[activeLocale] ? effectiveStatus.locales[activeLocale] : null

  const { loading: translating, execute: executeTranslate } = useAction<void>({
    successMessage: t.admin_translation_complete_success,
    onSuccess: async () => {
      if (activeLocale) {
        setDetailsCache(prev => {
          const next = { ...prev }
          delete next[activeLocale]
          return next
        })
        const updatedDetails = await fetchDetailsForLocale(activeLocale)

        if (updatedDetails) {
          const allFields = [
            ...updatedDetails.listing,
            ...updatedDetails.itineraries.flatMap(it => it.fields),
            ...(updatedDetails.stayDetail ?? []),
          ]
          const total = allFields.length
          const completed = allFields.filter(f => f.status === 'completed').length
          const hasFailed = allFields.some(f => f.status === 'failed')
          const hasPending = allFields.some(f => f.status === 'pending')

          let newStatus: TranslationStatusKey = 'none'
          if (hasFailed) newStatus = 'failed'
          else if (hasPending) newStatus = 'pending'
          else if (completed >= total && total > 0) newStatus = 'complete'
          else if (completed > 0) newStatus = 'partial'

          setLocalStatus({
            status: newStatus,
            locales: {
              ...effectiveStatus?.locales,
              [activeLocale]: { status: newStatus, completed, total },
            },
          })
        }
      }
      onTranslationComplete?.()
    },
  })

  async function fetchLocales(): Promise<string[]> {
    const data = await api.get<string[]>('/translations/locales', authHeaders)
    return data
  }

  async function fetchDetailsForLocale(locale: string): Promise<TranslationDetails | null> {
    setLoadingDetails(true)
    setFetchError(false)
    try {
      const normalizedData = await source.fetchDetails(listingId, locale, authHeaders)
      setDetailsCache(prev => ({ ...prev, [locale]: normalizedData }))
      return normalizedData
    } catch {
      setFetchError(true)
      return null
    } finally {
      setLoadingDetails(false)
    }
  }

  async function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) return

    try {
      let resolvedLocales = locales
      if (resolvedLocales.length === 0) {
        resolvedLocales = await fetchLocales()
        setLocales(resolvedLocales)
      }

      const first = resolvedLocales[0] ?? null
      if (!first) return

      setActiveLocale(first)

      if (!detailsCache[first]) {
        await fetchDetailsForLocale(first)
      }
    } catch {
      setFetchError(true)
    }
  }

  async function handleTabChange(locale: string) {
    setActiveLocale(locale)
    if (!detailsCache[locale]) {
      await fetchDetailsForLocale(locale)
    }
  }

  function handleTranslate() {
    executeTranslate(async () => {
      await source.requestComplete(listingId, activeLocale, authHeaders)
      return { success: true }
    })
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-opacity hover:opacity-80 ${bg}`}
        >
          <LanguagesIcon className="size-3" />
          {t[labelKey]}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-4">
        <p className="mb-3 text-sm font-semibold">{t.admin_translation_title}</p>

        {locales.length > 0 && (
          <div className="mb-3 flex gap-3 border-b pb-2">
            {locales.map(locale => (
              <button
                key={locale}
                type="button"
                onClick={() => handleTabChange(locale)}
                className={
                  activeLocale === locale
                    ? 'border-b-2 border-primary pb-1 text-xs font-semibold'
                    : 'pb-1 text-xs text-muted-foreground hover:text-foreground'
                }
              >
                {locale.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {activeLocaleInfo && (
          <p className="mb-2 text-[11px] text-muted-foreground">
            {activeLocale?.toUpperCase()} {activeLocaleInfo.completed}/{activeLocaleInfo.total}
          </p>
        )}

        {loadingDetails ? (
          <div className="flex items-center justify-center py-6">
            <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <XIcon className="size-4 text-red-400" />
            <p className="text-xs text-muted-foreground">{t.admin_common_error}</p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => activeLocale && fetchDetailsForLocale(activeLocale)}
            >
              {t.admin_common_retry}
            </Button>
          </div>
        ) : activeDetails === null ? null : (
          <div>
            {activeDetails.listing.length > 0 && (
              <>
                <SectionHeader>{t[source.sectionLabelKey]}</SectionHeader>
                {activeDetails.listing.map(f => (
                  <FieldRow key={f.field} field={f.field} status={f.status} />
                ))}
              </>
            )}

            {activeDetails.itineraries.length > 0 && (
              <>
                <SectionHeader>{t.admin_translation_itinerary_section}</SectionHeader>
                {activeDetails.itineraries.map(it => (
                  <div key={it.id} className="mb-2">
                    <p className="mb-0.5 text-[11px] font-medium text-foreground/70">{it.title}</p>
                    {it.fields.map(f => (
                      <FieldRow key={f.field} field={f.field} status={f.status} />
                    ))}
                  </div>
                ))}
              </>
            )}

            {activeDetails.stayDetail && activeDetails.stayDetail.length > 0 && (
              <>
                <SectionHeader>{t.admin_translation_stay_detail_section}</SectionHeader>
                {activeDetails.stayDetail.map(f => (
                  <FieldRow key={f.field} field={f.field} status={f.status} />
                ))}
              </>
            )}

            {!hasMissing ? (
              <p className="mt-3 text-[11px] text-emerald-600">{t.admin_translation_all_done}</p>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="mt-4 w-full"
                disabled={translating}
                onClick={handleTranslate}
              >
                {translating ? <LoaderIcon className="size-3.5 animate-spin" /> : null}
                {t.admin_translation_complete_btn}
              </Button>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

// ==================== EXPLICIT VARIANTS ====================

export function ListingTranslationStatusPopover(props: VariantProps) {
  return <TranslationStatusPopover {...props} source={listingSource} />
}

export function CategoryTranslationStatusPopover(props: VariantProps) {
  return <TranslationStatusPopover {...props} source={categorySource} />
}

export function ProductTranslationStatusPopover(props: VariantProps) {
  return <TranslationStatusPopover {...props} source={productSource} />
}
