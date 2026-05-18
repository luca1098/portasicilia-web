'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import {
  partnerApplicationSchema,
  type PartnerApplicationFormValues,
} from '@/lib/schemas/partner-application.schema'
import { submitPartnerApplication } from '@/lib/api/partner-applications'
import type { SubmitPartnerApplicationResponse } from '@/lib/types/partner-application.type'
import ApplicationWizardStepper from './application-wizard-stepper'
import ApplicationWizardStep1 from './application-wizard-step-1'
import ApplicationWizardStep2 from './application-wizard-step-2'
import ApplicationWizardStep3 from './application-wizard-step-3'

type Props = { lang: 'it' | 'en' }

const STEP_FIELDS: Record<1 | 2, (keyof PartnerApplicationFormValues)[]> = {
  1: ['listingInterests', 'businessName', 'vatNumber', 'website', 'instagramUrl', 'facebookUrl', 'tiktokUrl'],
  2: ['firstName', 'lastName', 'email', 'phone', 'role'],
}

export default function ApplicationWizard({ lang }: Props) {
  const t = useTranslation()
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const methods = useForm<PartnerApplicationFormValues>({
    resolver: zodResolver(partnerApplicationSchema),
    mode: 'onTouched',
    defaultValues: {
      listingInterests: [],
      businessName: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      locality: '',
      description: '',
      pitch: '',
      gdprConsent: false as unknown as true,
      applicantLang: lang.toUpperCase() as 'IT' | 'EN',
    },
  })

  const { loading, execute } = useAction<SubmitPartnerApplicationResponse>({
    onSuccess: () => router.push(`/${lang}/partner/candidatura/grazie`),
    errorMessage: t.partner_form_error_generic,
  })

  const onSubmit = (values: PartnerApplicationFormValues) => {
    execute(async () => {
      const data = await submitPartnerApplication(values)
      return { success: true as const, data }
    })
  }

  const onContinue = async () => {
    if (step >= 3) return
    const fields = STEP_FIELDS[step as 1 | 2]
    const valid = await methods.trigger(fields)
    if (valid) setStep((step + 1) as 1 | 2 | 3)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mx-auto max-w-2xl">
        <ApplicationWizardStepper current={step} />

        {step === 1 && <ApplicationWizardStep1 />}
        {step === 2 && <ApplicationWizardStep2 />}
        {step === 3 && <ApplicationWizardStep3 />}

        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((step - 1) as 1 | 2 | 3)}
              className="rounded border px-5 py-2"
            >
              {t.partner_form_back}
            </button>
          )}
          {step < 3 && (
            <button
              type="button"
              onClick={onContinue}
              className="ml-auto rounded bg-[#1a4d3a] px-6 py-2 text-white"
            >
              {t.partner_form_continue}
            </button>
          )}
          {step === 3 && (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto rounded bg-[#1a4d3a] px-6 py-2 text-white disabled:opacity-50"
            >
              {loading ? t.partner_form_submitting : t.partner_form_submit}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
