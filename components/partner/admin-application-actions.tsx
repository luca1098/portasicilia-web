'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { updatePartnerApplication } from '@/lib/api/partner-applications'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { LoaderIcon } from '@/lib/constants/icons'
import type { PartnerApplicationDetail, PartnerApplicationStatus } from '@/lib/types/partner-application.type'

type Props = { application: PartnerApplicationDetail }

export default function AdminApplicationActions({ application }: Props) {
  const t = useTranslation()
  const router = useRouter()
  const { data: session } = useSession()
  const [adminNotes, setAdminNotes] = useState(application.adminNotes ?? '')
  const [rejectionReason, setRejectionReason] = useState(application.rejectionReason ?? '')
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)

  const isReadOnly = application.status === 'APPROVED'

  const { execute, loading } = useAction<PartnerApplicationDetail>({
    onSuccess: () => router.refresh(),
    successMessage: t.partner_admin_action_success,
    errorMessage: t.partner_admin_action_error,
  })

  const runStatusChange = (patch: {
    status?: PartnerApplicationStatus
    adminNotes?: string
    rejectionReason?: string
  }) => {
    void execute(async () => {
      const headers = session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : undefined
      const data = await updatePartnerApplication(application.id, patch, headers)
      return { success: true as const, data }
    })
  }

  const onMarkInReview = () => runStatusChange({ status: 'IN_REVIEW', adminNotes: adminNotes || undefined })

  const onConfirmApprove = () => {
    setApproveDialogOpen(false)
    runStatusChange({ status: 'APPROVED', adminNotes: adminNotes || undefined })
  }

  const onConfirmReject = () => {
    setRejectDialogOpen(false)
    runStatusChange({
      status: 'REJECTED',
      rejectionReason: rejectionReason.trim(),
      adminNotes: adminNotes || undefined,
    })
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isReadOnly || loading || application.status === 'IN_REVIEW'}
          onClick={onMarkInReview}
        >
          {t.partner_admin_action_review}
        </Button>
        <Button
          type="button"
          className="w-full"
          disabled={isReadOnly || loading}
          onClick={() => setApproveDialogOpen(true)}
        >
          {loading && <LoaderIcon className="size-4 animate-spin" />}
          {t.partner_admin_action_approve}
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="w-full"
          disabled={isReadOnly || loading}
          onClick={() => setRejectDialogOpen(true)}
        >
          {t.partner_admin_action_reject}
        </Button>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm text-muted-foreground" htmlFor="admin-notes">
          {t.partner_admin_admin_notes_label}
        </label>
        <Textarea
          id="admin-notes"
          rows={4}
          value={adminNotes}
          disabled={isReadOnly}
          onChange={e => setAdminNotes(e.target.value)}
          onBlur={() => {
            if (adminNotes !== (application.adminNotes ?? '')) {
              runStatusChange({ adminNotes })
            }
          }}
        />
      </div>

      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.partner_admin_action_approve}</AlertDialogTitle>
            <AlertDialogDescription>{t.partner_admin_approve_confirm}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.partner_admin_cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmApprove} disabled={loading}>
              {t.partner_admin_action_approve}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.partner_admin_action_reject}</AlertDialogTitle>
            <AlertDialogDescription>{t.partner_admin_reject_reason_label}</AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            rows={3}
            value={rejectionReason}
            onChange={e => setRejectionReason(e.target.value)}
            placeholder={t.partner_admin_reject_reason_label}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>{t.partner_admin_cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmReject}
              disabled={rejectionReason.trim().length < 5 || loading}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {t.partner_admin_action_reject}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
