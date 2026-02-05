'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supportedLocales } from '@/lib/configs/locales'

const flagMap: Record<string, string> = {
  it: 'IT',
  en: 'EN',
}

export default function LangSwitch() {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const currentLang = params.lang as string

  const handleSwitch = () => {
    const nextLang = supportedLocales.find(l => l !== currentLang) ?? supportedLocales[0]
    const newPath = pathname.replace(`/${currentLang}`, `/${nextLang}`)
    router.push(newPath)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSwitch} aria-label="Switch language">
      {flagMap[currentLang] ?? currentLang.toUpperCase()}
    </Button>
  )
}
