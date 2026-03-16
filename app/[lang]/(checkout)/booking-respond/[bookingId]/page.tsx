'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/context/translation.context'
import { api } from '@/lib/api/fetch-client'
import { useAction } from '@/lib/hooks/use-action'
import { useCounterProposals } from '@/lib/hooks/use-counter-proposals'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { InputWrapper } from '@/components/form/input-wrapper'
import ProposalCards from '@/components/shared/proposal-cards'
import { CheckCircle2Icon, XIcon, AlertTriangleIcon, CalendarIcon, LoaderIcon } from '@/lib/constants/icons'

type TimeSlot = { id: string; startTime: string; endTime: string }

function ResultView({ variant }: { variant: 'accepted' | 'rejected' | 'counter-accepted' | 'error' }) {
  const t = useTranslation()
  const { lang } = useParams<{ lang: string }>()

  const config = {
    accepted: {
      icon: CheckCircle2Icon,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      title: t.booking_respond_accepted_title,
      desc: t.booking_respond_accepted_desc,
    },
    rejected: {
      icon: XIcon,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      title: t.booking_respond_rejected_title,
      desc: t.booking_respond_rejected_desc,
    },
    'counter-accepted': {
      icon: CheckCircle2Icon,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      title: t.booking_respond_counter_accepted_title,
      desc: t.booking_respond_counter_accepted_desc,
    },
    error: {
      icon: AlertTriangleIcon,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      title: t.booking_respond_error_title,
      desc: t.booking_respond_error_desc,
    },
  }[variant]

  const Icon = config.icon

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="flex justify-center">
        <div className={`flex size-16 items-center justify-center rounded-full ${config.iconBg}`}>
          <Icon className={`size-9 ${config.iconColor}`} aria-hidden="true" />
        </div>
      </div>

      <h1 className="mt-6 text-center text-xl font-bold leading-snug">{config.title}</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">{config.desc}</p>

      <div className="mt-8">
        <Button className="h-11 w-full" asChild>
          <Link href={`/${lang}`}>{t.booking_respond_back_home}</Link>
        </Button>
      </div>
    </div>
  )
}

function CounterProposalForm({ token }: { token: string }) {
  const t = useTranslation() as Record<string, string>
  const { lang } = useParams<{ lang: string }>()

  const {
    proposals,
    message,
    allValid,
    setMessage,
    addProposal,
    removeProposal,
    updateProposal,
    getValidProposals,
  } = useCounterProposals()

  const [submitted, setSubmitted] = useState(false)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  const { loading, execute } = useAction<void>({
    successMessage: t.booking_respond_counter_success,
    onSuccess: () => setSubmitted(true),
  })

  function handleSubmit() {
    const validProposals = getValidProposals()
    if (validProposals.length === 0) return

    execute(async () => {
      await api.post('/bookings/magic/counter', {
        token,
        counterProposals: validProposals,
        responseMessage: message || undefined,
      })
      return { success: true }
    })
  }

  useEffect(() => {
    api
      .get<{
        listing: { experienceDetail?: { timeSlots: TimeSlot[] } }
      }>(`/bookings/magic/${token}/details`)
      .then(data => {
        if (data?.listing?.experienceDetail?.timeSlots?.length) {
          setTimeSlots(data.listing.experienceDetail.timeSlots)
        }
      })
      .catch(err => {
        console.error('[CounterProposal] Failed to fetch time slots:', err)
      })
  }, [token])

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2Icon className="size-9 text-emerald-600" aria-hidden="true" />
          </div>
        </div>

        <h1 className="mt-6 text-center text-xl font-bold leading-snug">
          {t.booking_respond_counter_sent_title}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {t.booking_respond_counter_sent_desc}
        </p>

        <div className="mt-8">
          <Button className="h-11 w-full" asChild>
            <Link href={`/${lang}`}>{t.booking_respond_back_home}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="flex justify-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <CalendarIcon className="size-9 text-primary" aria-hidden="true" />
        </div>
      </div>

      <h1 className="mt-6 text-center text-xl font-bold leading-snug">{t.booking_respond_counter_title}</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">{t.booking_respond_counter_desc}</p>

      <div className="mt-8 rounded-xl border bg-background">
        <div className="space-y-4 p-5">
          <ProposalCards
            proposals={proposals}
            timeSlots={timeSlots}
            labels={{
              proposalLabel: t.owner_request_counter_proposal_label,
              removeLabel: t.owner_request_counter_remove,
              dateLabel: t.booking_respond_counter_date,
              timeslotLabel: t.booking_respond_counter_timeslot,
              addDateLabel: t.booking_respond_counter_add_date,
            }}
            onUpdate={updateProposal}
            onRemove={removeProposal}
            onAdd={addProposal}
          />
        </div>

        <hr className="border-border" />

        <div className="p-5">
          <InputWrapper label={t.booking_respond_counter_message} hasValue={!!message}>
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={t.booking_respond_counter_message_placeholder}
              maxLength={1000}
              rows={3}
            />
          </InputWrapper>
        </div>
      </div>

      <div className="mt-6">
        <Button className="h-11 w-full" onClick={handleSubmit} disabled={loading || !allValid}>
          {loading && <LoaderIcon className="mr-2 size-4 animate-spin" />}
          {loading ? t.booking_respond_counter_submitting : t.booking_respond_counter_submit}
        </Button>
      </div>
    </div>
  )
}

export default function BookingRespondPage() {
  const searchParams = useSearchParams()

  const result = searchParams.get('result')
  const mode = searchParams.get('mode')
  const token = searchParams.get('token')

  if (mode === 'counter' && token) {
    return <CounterProposalForm token={token} />
  }

  if (result === 'accepted' || result === 'rejected' || result === 'counter-accepted') {
    return <ResultView variant={result} />
  }

  return <ResultView variant="error" />
}
