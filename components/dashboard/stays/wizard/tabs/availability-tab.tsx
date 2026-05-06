'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { useAction } from '@/lib/hooks/use-action'
import { setStayIcsUrlAction, syncStayIcsAction } from '@/lib/actions/stays.actions'
import {
  LoaderIcon,
  CalendarIcon,
  Link2Icon,
  RefreshCwIcon,
  UnlinkIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  CopyIcon,
} from '@/lib/constants/icons'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import type { StayAvailability } from '@/lib/schemas/entities/stay.entity.schema'

type AvailabilityTabProps = {
  stayId: string
  stay: Stay
  onSaved?: (updated: Stay) => void
}

export default function AvailabilityTab({ stayId, stay, onSaved }: AvailabilityTabProps) {
  const t = useTranslation() as Record<string, string>

  const existingAvailability: StayAvailability[] = stay.stayDetail?.availability ?? stay.availability ?? []
  const icsRanges = existingAvailability.filter(a => a.source === 'ICS')

  const stayDetail = stay.stayDetail
  const [icsUrl, setIcsUrl] = useState(stayDetail?.icsUrl ?? '')
  const hasIcs = !!stayDetail?.icsUrl
  const [exportCopied, setExportCopied] = useState(false)

  const { loading: icsConnecting, execute: executeIcsConnect } = useAction<Stay>({
    successMessage: t.admin_stay_ics_connect_success,
    onSuccess: data => {
      if (data) onSaved?.(data)
    },
  })

  const { loading: icsDisconnecting, execute: executeIcsDisconnect } = useAction<Stay>({
    successMessage: t.admin_stay_ics_disconnect_success,
    onSuccess: data => {
      if (data) {
        setIcsUrl('')
        onSaved?.(data)
      }
    },
  })

  const { loading: icsSyncing, execute: executeIcsSync } = useAction<Stay>({
    successMessage: t.admin_stay_ics_sync_success,
    onSuccess: data => {
      if (data) onSaved?.(data)
    },
  })

  const handleConnectIcs = async () => {
    if (!icsUrl.trim()) return
    await executeIcsConnect(() => setStayIcsUrlAction(stayId, { icsUrl: icsUrl.trim() }))
  }

  const handleDisconnectIcs = async () => {
    await executeIcsDisconnect(() => setStayIcsUrlAction(stayId, { icsUrl: null }))
  }

  const handleSyncIcs = async () => {
    await executeIcsSync(() => syncStayIcsAction(stayId))
  }

  const handleCopyExportUrl = async () => {
    const url = `${window.location.origin}/api/stays/calendar/${stayDetail?.icsExportToken}.ics`
    await navigator.clipboard.writeText(url)
    setExportCopied(true)
    setTimeout(() => setExportCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* ICS Calendar Section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold">{t.admin_stay_ics_title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t.admin_stay_ics_subtitle}</p>
        </div>

        {hasIcs ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-3">
              <CheckCircle2Icon className="size-4 shrink-0 text-emerald-500" />
              <span className="flex-1 truncate text-sm">{stayDetail?.icsUrl}</span>
            </div>

            {stayDetail?.icsSyncedAt && (
              <p className="text-xs text-muted-foreground">
                {interpolate(t.admin_stay_ics_last_sync, {
                  date: new Date(stayDetail.icsSyncedAt).toLocaleString(),
                })}
              </p>
            )}

            {stayDetail?.icsSyncError && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
                <p className="text-xs text-destructive">
                  {interpolate(t.admin_stay_ics_sync_error, { error: stayDetail.icsSyncError })}
                </p>
              </div>
            )}

            <p className="text-xs text-muted-foreground">{t.admin_stay_ics_sync_info}</p>

            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleSyncIcs} disabled={icsSyncing}>
                {icsSyncing ? (
                  <LoaderIcon className="size-4 animate-spin" />
                ) : (
                  <RefreshCwIcon className="size-4" />
                )}
                {icsSyncing ? t.admin_stay_ics_syncing : t.admin_stay_ics_sync_now}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDisconnectIcs}
                disabled={icsDisconnecting}
              >
                {icsDisconnecting ? (
                  <LoaderIcon className="size-4 animate-spin" />
                ) : (
                  <UnlinkIcon className="size-4" />
                )}
                {t.admin_stay_ics_disconnect}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              value={icsUrl}
              onChange={e => setIcsUrl(e.target.value)}
              placeholder={t.admin_stay_ics_url_placeholder}
              className="flex-1"
            />
            <Button type="button" onClick={handleConnectIcs} disabled={icsConnecting || !icsUrl.trim()}>
              {icsConnecting ? (
                <LoaderIcon className="size-4 animate-spin" />
              ) : (
                <Link2Icon className="size-4" />
              )}
              {t.admin_stay_ics_connect}
            </Button>
          </div>
        )}
      </div>

      {/* ICS Export Section */}
      {stayDetail?.icsExportToken && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">{t.admin_stay_ics_export_title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{t.admin_stay_ics_export_subtitle}</p>
          </div>

          <div className="flex gap-2">
            <Input
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/stays/calendar/${stayDetail.icsExportToken}.ics`}
              readOnly
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={handleCopyExportUrl}>
              {exportCopied ? (
                <CheckCircle2Icon className="size-4 text-emerald-500" />
              ) : (
                <CopyIcon className="size-4" />
              )}
              {exportCopied ? t.admin_stay_ics_export_copied : t.admin_stay_ics_export_title}
            </Button>
          </div>
        </div>
      )}

      {/* Blocked dates from ICS (read-only) */}
      {icsRanges.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">{t.admin_stay_availability_title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{t.admin_stay_availability_subtitle}</p>
          </div>

          <div className="space-y-3">
            {icsRanges.map(range => (
              <div
                key={range.id}
                className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:flex-row sm:items-end"
              >
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs">{t.admin_stay_availability_from}</Label>
                  <Input type="date" value={range.dateFrom.split('T')[0]} disabled />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs">{t.admin_stay_availability_to}</Label>
                  <Input type="date" value={range.dateTo.split('T')[0]} disabled />
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {t.admin_stay_availability_ics_badge}
                  </span>
                  <span className="text-xs text-muted-foreground">{t.admin_stay_availability_blocked}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state when no ICS connected */}
      {!hasIcs && (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <CalendarIcon className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{t.admin_stay_availability_empty}</p>
        </div>
      )}
    </div>
  )
}
