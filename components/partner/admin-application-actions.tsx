'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { updatePartnerApplication } from '@/lib/api/partner-applications'
import type { PartnerApplicationDetail, PartnerApplicationStatus } from '@/lib/types/partner-application.type'

type Props = { application: PartnerApplicationDetail }

export default function AdminApplicationActions({ application }: Props) {
  const t = useTranslation()
  const router = useRouter()
  const [adminNotes, setAdminNotes] = useState(application.adminNotes ?? '')
  const [rejectionReason, setRejectionReason] = useState(application.rejectionReason ?? '')
  const [showRejectForm, setShowRejectForm] = useState(false)

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
      const data = await updatePartnerApplication(application.id, patch)
      return { success: true as const, data }
    })
  }

  const onApprove = () => {
    if (window.confirm(t.partner_admin_approve_confirm)) {
      runStatusChange({ status: 'APPROVED', adminNotes: adminNotes || undefined })
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="space-y-2">
        <button
          type="button"
          disabled={isReadOnly || loading || application.status === 'IN_REVIEW'}
          onClick={() =>
            runStatusChange({
              status: 'IN_REVIEW',
              adminNotes: adminNotes || undefined,
            })
          }
          className="w-full rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50 hover:bg-accent transition-colors"
        >
          {t.partner_admin_action_review}
        </button>
        <button
          type="button"
          disabled={isReadOnly || loading}
          onClick={onApprove}
          className="w-full rounded-lg bg-[#1a4d3a] px-3 py-2 text-sm text-white disabled:opacity-50 hover:bg-[#153d2e] transition-colors"
        >
          {t.partner_admin_action_approve}
        </button>
        <button
          type="button"
          disabled={isReadOnly || loading}
          onClick={() => setShowRejectForm(true)}
          className="w-full rounded-lg bg-destructive px-3 py-2 text-sm text-destructive-foreground disabled:opacity-50 hover:bg-destructive/90 transition-colors"
        >
          {t.partner_admin_action_reject}
        </button>
      </div>

      <label className="block text-sm">
        <span className="text-muted-foreground">{t.partner_admin_admin_notes_label}</span>
        <textarea
          rows={4}
          value={adminNotes}
          disabled={isReadOnly}
          onChange={e => setAdminNotes(e.target.value)}
          onBlur={() => {
            if (adminNotes !== (application.adminNotes ?? '')) {
              runStatusChange({ adminNotes })
            }
          }}
          className="mt-1 w-full rounded-lg border border-border px-2 py-1 text-sm disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </label>

      {showRejectForm && (
        <div className="space-y-2 rounded-lg border-l-4 border-destructive bg-destructive/5 p-3">
          <label className="block text-sm">
            <span>{t.partner_admin_reject_reason_label}</span>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </label>
          <button
            type="button"
            disabled={rejectionReason.trim().length < 5 || loading}
            onClick={() =>
              runStatusChange({
                status: 'REJECTED',
                rejectionReason: rejectionReason.trim(),
                adminNotes: adminNotes || undefined,
              })
            }
            className="rounded-lg bg-destructive px-3 py-2 text-sm text-destructive-foreground disabled:opacity-50 hover:bg-destructive/90 transition-colors"
          >
            {t.partner_admin_action_reject}
          </button>
        </div>
      )}
    </div>
  )
}
