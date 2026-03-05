'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/context/translation.context'
import { api } from '@/lib/api/fetch-client'
import { useAction } from '@/lib/hooks/use-action'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  CheckCircle2Icon,
  XIcon,
  AlertTriangleIcon,
  CalendarIcon,
  PlusIcon,
  Trash2Icon,
  LoaderIcon,
} from '@/lib/constants/icons'

type CounterProposal = { date: string; timeSlotId?: string }
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
  const t = useTranslation()
  const { lang } = useParams<{ lang: string }>()

  const [proposals, setProposals] = useState<CounterProposal[]>([{ date: '' }])
  const [responseMessage, setResponseMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  const { loading, execute } = useAction<void>({
    successMessage: t.booking_respond_counter_success,
    onSuccess: () => setSubmitted(true),
  })

  const addProposal = () => {
    setProposals(prev => [...prev, { date: '' }])
  }

  const removeProposal = (index: number) => {
    setProposals(prev => prev.filter((_, i) => i !== index))
  }

  const updateProposal = (index: number, field: keyof CounterProposal, value: string) => {
    setProposals(prev => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)))
  }

  const handleSubmit = () => {
    const validProposals = proposals.filter(p => p.date)
    if (validProposals.length === 0) return

    execute(async () => {
      await api.post('/bookings/magic/counter', {
        token,
        counterProposals: validProposals.map(p => ({
          date: p.date,
          ...(p.timeSlotId ? { timeSlotId: p.timeSlotId } : {}),
        })),
        responseMessage: responseMessage || undefined,
      })
      return { success: true }
    })
  }

  useEffect(() => {
    api
      .get<{
        experience: { timeSlots: TimeSlot[] }
      }>(`/bookings/magic/${token}/details`)
      .then(data => {
        if (data?.experience?.timeSlots?.length) {
          setTimeSlots(data.experience.timeSlots)
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

  const minDate = new Date().toISOString().split('T')[0]
  const hasValidDate = proposals.some(p => p.date)

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
        <div className="space-y-3 p-5">
          {proposals.map((proposal, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 space-y-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {t.booking_respond_counter_date} {index + 1}
                  </label>
                  <Input
                    type="date"
                    value={proposal.date}
                    onChange={e => updateProposal(index, 'date', e.target.value)}
                    min={minDate}
                  />
                </div>
                {timeSlots.length > 0 && (
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      {t.booking_respond_counter_timeslot}
                    </label>
                    <Select
                      value={proposal.timeSlotId ?? ''}
                      onValueChange={v => updateProposal(index, 'timeSlotId', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.booking_respond_counter_timeslot_placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(slot => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {slot.startTime} - {slot.endTime}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              {proposals.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-6 shrink-0"
                  onClick={() => removeProposal(index)}
                >
                  <Trash2Icon className="size-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          ))}

          {proposals.length < 3 && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={addProposal}>
              <PlusIcon className="size-3.5" />
              {t.booking_respond_counter_add_date}
            </Button>
          )}
        </div>

        <hr className="border-border" />

        <div className="p-5">
          <label className="mb-1 block text-sm font-medium">{t.booking_respond_counter_message}</label>
          <Textarea
            value={responseMessage}
            onChange={e => setResponseMessage(e.target.value)}
            placeholder={t.booking_respond_counter_message_placeholder}
            maxLength={1000}
            rows={3}
          />
        </div>
      </div>

      <div className="mt-6">
        <Button className="h-11 w-full" onClick={handleSubmit} disabled={loading || !hasValidDate}>
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
