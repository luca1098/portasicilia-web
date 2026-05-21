'use client'

import { Button } from '@/components/ui/button'

type Props = { label: string }

export default function CookieSettingsButton({ label }: Props) {
  const openSettings = () => {
    const cmp = (window as unknown as { __ucCmp?: { showSecondLayer: () => void } }).__ucCmp
    cmp?.showSecondLayer()
  }
  return (
    <Button type="button" variant="outline" onClick={openSettings}>
      {label}
    </Button>
  )
}
