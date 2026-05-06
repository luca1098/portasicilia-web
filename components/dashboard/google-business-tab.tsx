'use client'

import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFormField } from '@/components/form/input-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { updateExperienceAction } from '@/lib/actions/experiences.actions'
import { updateStayAction } from '@/lib/actions/stays.actions'
import { toFormData } from '@/lib/utils/form-data.utils'
import { useAction } from '@/lib/hooks/use-action'
import { syncGoogleReviewsAction } from '@/lib/actions/reviews.actions'
import { LoaderIcon, GoogleIcon, ChevronDownIcon, RefreshCwIcon } from '@/lib/constants/icons'
import type { ActionResult } from '@/lib/actions/action.types'

const GoogleBusinessSchema = z.object({
  googleBusinessUrl: z.string().url().or(z.literal('')).optional(),
})

type GoogleBusinessFormValues = z.infer<typeof GoogleBusinessSchema>

type GoogleBusinessTabProps = {
  listingId: string
  listingType: 'experience' | 'stay'
  googleBusinessUrl?: string | null
}

const GUIDE_STEP_KEYS = ['step1', 'step2', 'step3', 'step4'] as const

type GuideSectionProps = {
  title: string
  steps: Array<{ title: string; text: string }>
  note: string
}

function GuideSection({ title, steps, note }: GuideSectionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-lg border border-border bg-muted/50">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
      >
        {title}
        <ChevronDownIcon
          className={`size-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="space-y-4 border-t border-border px-4 py-4 text-sm text-muted-foreground">
          {steps.map(step => (
            <div key={step.title}>
              <p className="font-medium text-foreground">{step.title}</p>
              <p>{step.text}</p>
            </div>
          ))}
          <p className="text-xs italic">{note}</p>
        </div>
      )}
    </div>
  )
}

export default function GoogleBusinessTab({
  listingId,
  listingType,
  googleBusinessUrl,
}: GoogleBusinessTabProps) {
  const t = useTranslation() as Record<string, string>

  const [savedUrl, setSavedUrl] = useState(googleBusinessUrl ?? '')

  const form = useForm<GoogleBusinessFormValues>({
    resolver: zodResolver(GoogleBusinessSchema),
    defaultValues: {
      googleBusinessUrl: googleBusinessUrl ?? '',
    },
  })

  const { loading, execute } = useAction<unknown>({
    successMessage: t.admin_google_business_save_success,
    onSuccess: () => {
      setSavedUrl(form.getValues('googleBusinessUrl') ?? '')
    },
  })

  const [syncResult, setSyncResult] = useState<{ imported: number; skipped: number } | null>(null)

  const { loading: syncing, execute: executeSync } = useAction<{ imported: number; skipped: number }>({
    onSuccess: data => {
      if (data) setSyncResult(data)
    },
  })

  const onSubmit = async (data: GoogleBusinessFormValues) => {
    const fd = toFormData({
      googleBusinessUrl: data.googleBusinessUrl || null,
    })
    const action: (id: string, formData: FormData) => Promise<ActionResult<unknown>> =
      listingType === 'experience' ? updateExperienceAction : updateStayAction
    await execute(() => action(listingId, fd))
  }

  const handleSync = () => {
    executeSync(() => syncGoogleReviewsAction(listingType, listingId))
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <GoogleIcon className="size-5" />
            <h3 className="text-sm font-semibold">{t.admin_google_business_title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{t.admin_google_business_description}</p>

          <GuideSection
            title={t.admin_google_business_guide_title}
            steps={GUIDE_STEP_KEYS.map(key => ({
              title: t[`admin_google_business_guide_${key}_title`],
              text: t[`admin_google_business_guide_${key}_text`],
            }))}
            note={t.admin_google_business_guide_note}
          />

          <InputFormField<GoogleBusinessFormValues>
            name="googleBusinessUrl"
            label={t.admin_google_business_url_label}
            placeholder="https://g.page/r/..."
            type="url"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {loading ? t.admin_exp_saving : t.admin_exp_save}
          </Button>
        </div>
      </form>

      {savedUrl && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4 mt-6">
          <h3 className="text-sm font-semibold">{t.admin_google_business_sync_title}</h3>
          <p className="text-sm text-muted-foreground">{t.admin_google_business_sync_description}</p>

          {syncResult && (
            <div className="rounded-lg bg-muted px-4 py-3 text-sm">
              <p>
                {t.admin_google_business_sync_imported}: <strong>{syncResult.imported}</strong>
              </p>
              <p>
                {t.admin_google_business_sync_skipped}: <strong>{syncResult.skipped}</strong>
              </p>
            </div>
          )}

          <Button type="button" variant="outline" disabled={syncing} onClick={handleSync}>
            {syncing ? <LoaderIcon className="size-4 animate-spin" /> : <RefreshCwIcon className="size-4" />}
            {syncing ? t.admin_google_business_syncing : t.admin_google_business_sync_now}
          </Button>
        </div>
      )}
    </FormProvider>
  )
}
