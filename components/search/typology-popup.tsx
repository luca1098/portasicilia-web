'use client'

import { useTranslation } from '@/lib/context/translation.context'

type Typology = 'experiences' | 'stays'

type TypologyPopupProps = {
  onSelect: (typology: Typology) => void
  onClose: () => void
}

export default function TypologyPopup({ onSelect, onClose }: TypologyPopupProps) {
  const t = useTranslation()

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl bg-white p-2 shadow-xl">
        <button
          type="button"
          className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-100"
          onClick={() => onSelect('experiences')}
        >
          {t.experiences}
        </button>
        <button
          type="button"
          className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-100"
          onClick={() => onSelect('stays')}
        >
          {t.stays}
        </button>
      </div>
    </>
  )
}
