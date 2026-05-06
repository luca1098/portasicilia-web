import { useState } from 'react'

export type Proposal = { date: Date | undefined; timeSlotId: string }

const EMPTY_PROPOSAL: Proposal = { date: undefined, timeSlotId: '' }
const MAX_PROPOSALS = 3

export function useCounterProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([{ ...EMPTY_PROPOSAL }])
  const [message, setMessage] = useState('')

  const allValid = proposals.every(p => p.date && p.timeSlotId)

  return {
    proposals,
    message,
    allValid,
    setMessage,
    addProposal: () => {
      if (proposals.length < MAX_PROPOSALS) {
        setProposals(prev => [...prev, { ...EMPTY_PROPOSAL }])
      }
    },
    removeProposal: (index: number) => {
      if (proposals.length > 1) {
        setProposals(prev => prev.filter((_, i) => i !== index))
      }
    },
    updateProposal: (index: number, updates: Partial<Proposal>) => {
      setProposals(prev => prev.map((p, i) => (i === index ? { ...p, ...updates } : p)))
    },
    reset: () => {
      setProposals([{ ...EMPTY_PROPOSAL }])
      setMessage('')
    },
    getValidProposals: () =>
      proposals
        .filter((p): p is Proposal & { date: Date } => p.date !== undefined && !!p.timeSlotId)
        .map(p => ({
          date: p.date.toISOString().split('T')[0],
          timeSlotId: p.timeSlotId,
        })),
  }
}
