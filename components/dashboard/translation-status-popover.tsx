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

type TranslationStatusPopoverProps = {
  listingId: string
  status: TranslationStatusValue | undefined
  onTranslationComplete?: () => void
}

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

export default function TranslationStatusPopover({
  listingId,
  status,
  onTranslationComplete,
}: TranslationStatusPopoverProps) {
  const [open, setOpen] = useState(false)
  const [activeLocale, setActiveLocale] = useState<string | null>(null)
  const [locales, setLocales] = useState<string[]>([])
  const [detailsCache, setDetailsCache] = useState<Record<string, TranslationDetails>>({})
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [fetchError, setFetchError] = useState(false)

  const { data: session } = useSession()
  const t = useTranslation() as Record<string, string>
  const authHeaders = session?.accessToken
    ? { headers: { Authorization: `Bearer ${session.accessToken}` } }
    : {}

  const resolvedStatus = status?.status ?? 'none'
  const { bg, labelKey } = STATUS_CONFIG[resolvedStatus]

  const activeDetails = activeLocale ? (detailsCache[activeLocale] ?? null) : null

  const hasMissing =
    activeDetails !== null &&
    (activeDetails.listing.some(f => f.status !== 'completed') ||
      activeDetails.itineraries.some(it => it.fields.some(f => f.status !== 'completed')) ||
      (activeDetails.stayDetail?.some(f => f.status !== 'completed') ?? false))

  const activeLocaleInfo =
    activeLocale && status?.locales?.[activeLocale] ? status.locales[activeLocale] : null

  const { loading: translating, execute: executeTranslate } = useAction<void>({
    successMessage: t.admin_translation_complete_success,
    onSuccess: async () => {
      if (activeLocale) {
        setDetailsCache(prev => {
          const next = { ...prev }
          delete next[activeLocale]
          return next
        })
        await fetchDetailsForLocale(activeLocale)
      }
      onTranslationComplete?.()
    },
  })

  async function fetchLocales(): Promise<string[]> {
    const data = await api.get<string[]>('/translations/locales', authHeaders)
    return data
  }

  async function fetchDetailsForLocale(locale: string) {
    setLoadingDetails(true)
    setFetchError(false)
    try {
      const data = await api.get<TranslationDetails>(
        `/translations/listing/${listingId}/details?locale=${locale}`,
        authHeaders
      )
      setDetailsCache(prev => ({ ...prev, [locale]: data }))
    } catch {
      setFetchError(true)
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
      await api.post(
        `/translations/listing/${listingId}/complete${activeLocale ? `?locale=${activeLocale}` : ''}`,
        undefined,
        authHeaders
      )
      return { success: true }
    })
  }

  if (!status) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_CONFIG.none.bg}`}
      >
        <LanguagesIcon className="size-3" />
        {t.admin_translation_none}
      </span>
    )
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
                <SectionHeader>{t.admin_translation_listing_section}</SectionHeader>
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
