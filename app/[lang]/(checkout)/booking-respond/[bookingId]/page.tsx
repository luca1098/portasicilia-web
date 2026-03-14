'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { api } from '@/lib/api/fetch-client'
import { useAction } from '@/lib/hooks/use-action'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { InputWrapper } from '@/components/form/input-wrapper'
import {
  CheckCircle2Icon,
  XIcon,
  AlertTriangleIcon,
  CalendarIcon,
  PlusIcon,
  Trash2Icon,
  LoaderIcon,
} from '@/lib/constants/icons'
import { formatDate, formatTime } from '@/lib/utils/format.utils'

type Proposal = { date: Date | undefined; timeSlotId: string }
type TimeSlot = { id: string; startTime: string; endTime: string }

const EMPTY_PROPOSAL: Proposal = { date: undefined, timeSlotId: '' }
const MAX_PROPOSALS = 3

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
  const t = useTranslation()
  const { lang } = useParams<{ lang: string }>()

  const [proposals, setProposals] = useState<Proposal[]>([{ ...EMPTY_PROPOSAL }])
  const [responseMessage, setResponseMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  const { loading, execute } = useAction<void>({
    successMessage: t.booking_respond_counter_success,
    onSuccess: () => setSubmitted(true),
  })

  const allProposalsValid = proposals.every(p => p.date && p.timeSlotId)

  function addProposal() {
    if (proposals.length < MAX_PROPOSALS) {
      setProposals(prev => [...prev, { ...EMPTY_PROPOSAL }])
    }
  }

  function removeProposal(index: number) {
    if (proposals.length > 1) {
      setProposals(prev => prev.filter((_, i) => i !== index))
    }
  }

  function updateProposal(index: number, updates: Partial<Proposal>) {
    setProposals(prev => prev.map((p, i) => (i === index ? { ...p, ...updates } : p)))
  }

  function handleSubmit() {
    const validProposals = proposals.filter(
      (p): p is Proposal & { date: Date } => p.date !== undefined && !!p.timeSlotId
    )
    if (validProposals.length === 0) return

    execute(async () => {
      await api.post('/bookings/magic/counter', {
        token,
        counterProposals: validProposals.map(p => ({
          date: p.date.toISOString().split('T')[0],
          timeSlotId: p.timeSlotId,
        })),
        responseMessage: responseMessage || undefined,
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
          {proposals.map((proposal, index) => (
            <div key={index} className="space-y-3 rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {interpolate(t.owner_request_counter_proposal_label, { number: index + 1 })}
                </span>
                {proposals.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProposal(index)}
                    className="h-7 gap-1 px-2 text-xs text-muted-foreground"
                  >
                    <Trash2Icon className="size-3" />
                    {t.owner_request_counter_remove}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InputWrapper label={t.booking_respond_counter_date} hasValue={!!proposal.date}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="border-input flex h-14 w-full items-center rounded-xl border bg-transparent px-3 pt-5 pb-1 text-left text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      >
                        {proposal.date ? formatDate(proposal.date.toISOString()) : ''}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={proposal.date}
                        onSelect={date => updateProposal(index, { date })}
                        disabled={date => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </InputWrapper>
                {timeSlots.length > 0 && (
                  <InputWrapper label={t.booking_respond_counter_timeslot} hasValue={!!proposal.timeSlotId}>
                    <Select
                      value={proposal.timeSlotId}
                      onValueChange={value => updateProposal(index, { timeSlotId: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(slot => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </InputWrapper>
                )}
              </div>
            </div>
          ))}

          {proposals.length < MAX_PROPOSALS && (
            <Button variant="outline" size="sm" className="w-full gap-1" onClick={addProposal}>
              <PlusIcon className="size-4" />
              {t.booking_respond_counter_add_date}
            </Button>
          )}
        </div>

        <hr className="border-border" />

        <div className="p-5">
          <InputWrapper label={t.booking_respond_counter_message} hasValue={!!responseMessage}>
            <Textarea
              value={responseMessage}
              onChange={e => setResponseMessage(e.target.value)}
              placeholder={t.booking_respond_counter_message_placeholder}
              maxLength={1000}
              rows={3}
            />
          </InputWrapper>
        </div>
      </div>

      <div className="mt-6">
        <Button className="h-11 w-full" onClick={handleSubmit} disabled={loading || !allProposalsValid}>
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
