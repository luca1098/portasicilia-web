'use client'

import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTranslation } from '@/lib/context/translation.context'
import { cn } from '@/lib/utils/shadcn.utils'

const EMOJI_GROUPS: { labelKey: string; emojis: string[] }[] = [
  {
    labelKey: 'emoji_group_experience',
    emojis: [
      '🧭',
      '🌊',
      '🏔️',
      '☀️',
      '🌅',
      '⛵',
      '⚓',
      '🐟',
      '🌳',
      '🍇',
      '🍴',
      '☕',
      '🔥',
      '🎨',
      '🎵',
      '📷',
      '🚲',
      '🏛️',
      '✨',
      '❤️',
      '⭐',
      '🗺️',
      '🥾',
      '🤿',
    ],
  },
  {
    labelKey: 'emoji_group_stay',
    emojis: ['🏠', '🛏️', '🏢', '🏰', '⛺', '🏝️', '🏖️', '🌄', '🛖', '🏡'],
  },
  {
    labelKey: 'emoji_group_shop',
    emojis: ['🛒', '🛍️', '🍷', '🫒', '🍯', '🧀', '🍋', '🍅', '🍞', '🌶️', '🍫', '🌿', '🧴', '🎁', '🍰', '🥖'],
  },
]

type EmojiPickerProps = {
  value?: string | null
  onChange: (emoji: string) => void
  label?: string
  triggerClassName?: string
}

export default function EmojiPicker({ value, onChange, label, triggerClassName }: EmojiPickerProps) {
  const t = useTranslation() as Record<string, string>
  const [open, setOpen] = useState(false)
  const current = value ?? ''

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium leading-none">{label}</label>}
      <div className="flex items-center gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                'flex size-12 items-center justify-center rounded-lg border bg-card text-2xl transition-colors hover:border-primary/40',
                triggerClassName
              )}
              aria-label={t.emoji_picker_open}
            >
              {current ? current : <span className="text-base text-muted-foreground/50">＋</span>}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" align="start">
            <div className="space-y-3">
              {EMOJI_GROUPS.map(group => (
                <div key={group.labelKey} className="space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {t[group.labelKey]}
                  </p>
                  <div className="grid grid-cols-8 gap-1">
                    {group.emojis.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          onChange(emoji)
                          setOpen(false)
                        }}
                        className={cn(
                          'flex size-8 items-center justify-center rounded-md text-lg transition-colors hover:bg-muted',
                          current === emoji && 'bg-primary/10 ring-1 ring-primary'
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {current && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('')
                    setOpen(false)
                  }}
                  className="w-full rounded-md py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
                >
                  {t.emoji_picker_clear}
                </button>
              )}
            </div>
          </PopoverContent>
        </Popover>
        {current && <span className="text-sm text-muted-foreground">{t.emoji_picker_selected}</span>}
      </div>
    </div>
  )
}
