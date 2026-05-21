'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import {
  createPartnerApplicationSchema,
  type PartnerApplicationFormValues,
} from '@/lib/schemas/partner-application.schema'
import { submitPartnerApplication } from '@/lib/api/partner-applications'
import type { SubmitPartnerApplicationResponse } from '@/lib/types/partner-application.type'
import { Button } from '@/components/ui/button'
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

  const schema = useMemo(() => createPartnerApplicationSchema(t), [t])

  const methods = useForm<PartnerApplicationFormValues>({
    resolver: zodResolver(schema),
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
      partnerTermsConsent: false as unknown as true,
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
            <Button type="button" variant="outline" onClick={() => setStep((step - 1) as 1 | 2 | 3)}>
              {t.partner_form_back}
            </Button>
          )}
          {step < 3 && (
            <Button type="button" onClick={onContinue} className="ml-auto">
              {t.partner_form_continue}
            </Button>
          )}
          {step === 3 && (
            <Button type="submit" disabled={loading} className="ml-auto">
              {loading ? t.partner_form_submitting : t.partner_form_submit}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
