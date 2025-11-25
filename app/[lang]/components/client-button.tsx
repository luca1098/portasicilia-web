'use client'

import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { useState } from 'react'

export default function ClientButton() {
  const t = useTranslation()
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{interpolate(t.count, { count })}</button>
}
