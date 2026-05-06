'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { InputWrapper } from '@/components/form/input-wrapper'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { deleteAdminOwnerAction } from '@/lib/actions/owners.actions'
import { useAction } from '@/lib/hooks/use-action'
import { AlertTriangleIcon, LoaderIcon, Trash2Icon } from '@/lib/constants/icons'
import { api } from '@/lib/api/fetch-client'
import type { OwnerDeletionPreview } from '@/lib/schemas/entities/owner.entity.schema'

type OwnerDeleteDialogProps = {
  ownerId: string
  ownerName: string
  ownerEmail: string
  open: boolean
  onOpenChange: (open: boolean) => void
  /** If true, redirect to owners list on success instead of refreshing */
  redirectOnSuccess?: boolean
  /** Called with the deleted owner id right after a successful delete, before the dialog closes */
  onDeleted?: (deletedId: string) => void
}

export default function OwnerDeleteDialog({
  ownerId,
  ownerName,
  ownerEmail,
  open,
  onOpenChange,
  redirectOnSuccess = false,
  onDeleted,
}: OwnerDeleteDialogProps) {
  const t = useTranslation()
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string

  const [preview, setPreview] = useState<OwnerDeletionPreview | null>(null)
  const [previewLoading, setPreviewLoading] = useState(true)
  const [confirmEmail, setConfirmEmail] = useState('')

  const canDelete = confirmEmail === ownerEmail

  const { loading, execute } = useAction({
    successMessage: t.admin_owners_delete_success,
    onSuccess: () => {
      onDeleted?.(ownerId)
      onOpenChange(false)
      if (redirectOnSuccess) {
        router.push(`/${lang}/dashboard/admin/owners`)
      }
      router.refresh()
    },
  })

  const handleDelete = () => execute(() => deleteAdminOwnerAction(ownerId))

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setConfirmEmail('')
      setPreview(null)
      setPreviewLoading(true)
    }
    onOpenChange(nextOpen)
  }

  useEffect(() => {
    if (!open) return

    api
      .get<OwnerDeletionPreview>(`/admin/owners/${ownerId}/deletion-preview`)
      .then(data => setPreview(data))
      .catch(() => setPreview(null))
      .finally(() => setPreviewLoading(false))
  }, [open, ownerId])

  const counts = preview?.counts
  const impactItems = counts
    ? [
        counts.experiences && counts.experiences > 0
          ? interpolate(t.admin_owners_delete_impact_experiences, { count: counts.experiences })
          : null,
        counts.stays && counts.stays > 0
          ? interpolate(t.admin_owners_delete_impact_stays, { count: counts.stays })
          : null,
        counts.products && counts.products > 0
          ? interpolate(t.admin_owners_delete_impact_products, { count: counts.products })
          : null,
        counts.bookings && counts.bookings > 0
          ? interpolate(t.admin_owners_delete_impact_bookings, { count: counts.bookings })
          : null,
        counts.orders && counts.orders > 0
          ? interpolate(t.admin_owners_delete_impact_orders, { count: counts.orders })
          : null,
        counts.reviews && counts.reviews > 0
          ? interpolate(t.admin_owners_delete_impact_reviews, { count: counts.reviews })
          : null,
      ].filter(Boolean)
    : []

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2Icon className="size-5" />
            {t.admin_owners_delete_title}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p
                dangerouslySetInnerHTML={{
                  __html: interpolate(t.admin_owners_delete_description, { name: ownerName }),
                }}
              />

              {/* Impact preview */}
              <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-2">
                {previewLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ) : impactItems.length > 0 ? (
                  <ul className="space-y-1 text-sm">
                    {impactItems.map(item => (
                      <li key={item} className="flex items-center gap-2 text-foreground">
                        <span className="size-1.5 rounded-full bg-destructive shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{t.admin_owners_delete_no_impact}</p>
                )}
              </div>

              {/* Warning banner */}
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 flex gap-2">
                <AlertTriangleIcon className="size-4 text-destructive mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-destructive">
                    {t.admin_owners_delete_warning_title}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.admin_owners_delete_warning_body}</p>
                </div>
              </div>

              {/* Email confirmation */}
              <InputWrapper
                label={t.admin_owners_delete_confirm_label}
                htmlFor="owner-delete-confirm-email"
                hasValue={!!confirmEmail}
              >
                <Input
                  id="owner-delete-confirm-email"
                  value={confirmEmail}
                  onChange={e => setConfirmEmail(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  disabled={loading}
                />
              </InputWrapper>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            {t.admin_owners_delete_cancel}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={!canDelete || loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {t.admin_owners_delete_confirm_cta}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
