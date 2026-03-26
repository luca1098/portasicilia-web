'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supportedLocales } from '@/lib/configs/locales'
import { cn } from '@/lib/utils/shadcn.utils'

const flagMap: Record<string, string> = {
  it: 'IT',
  en: 'EN',
}

interface LangSwitchProps {
  isTransparent?: boolean
}

export default function LangSwitch({ isTransparent }: LangSwitchProps) {
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
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSwitch}
      aria-label="Switch language"
      className={cn(
        'text-xs font-semibold tracking-wider',
        isTransparent &&
          'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] hover:bg-white/10 hover:text-white'
      )}
    >
      {flagMap[currentLang] ?? currentLang.toUpperCase()}
    </Button>
  )
}
