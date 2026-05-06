'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CheckIcon } from '@/lib/constants/icons'
import { supportedLocales } from '@/lib/configs/locales'
import { cn } from '@/lib/utils/shadcn.utils'

const localeConfig: Record<string, { flag: string; label: string }> = {
  it: { flag: '🇮🇹', label: 'ITA' },
  en: { flag: '🇬🇧', label: 'ENG' },
}

interface LangSwitchProps {
  isTransparent?: boolean
}

export default function LangSwitch({ isTransparent }: LangSwitchProps) {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const currentLang = params.lang as string
  const current = localeConfig[currentLang]

  const handleSelect = (lang: string) => {
    if (lang === currentLang) return
    const newPath = pathname.replace(`/${currentLang}`, `/${lang}`)
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Switch language"
          className={cn(
            'flex items-center gap-1.5 text-xs font-semibold tracking-wider',
            isTransparent &&
              'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] hover:bg-white/10 hover:text-white'
          )}
        >
          <span className="text-base leading-none">{current?.flag}</span>
          <span>{current?.label ?? currentLang.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {supportedLocales.map(lang => {
          const config = localeConfig[lang]
          const isActive = lang === currentLang
          return (
            <DropdownMenuItem
              key={lang}
              onClick={() => handleSelect(lang)}
              className="flex items-center gap-2 text-sm"
            >
              <span className="text-base leading-none">{config?.flag}</span>
              <span className={cn('font-medium', isActive && 'font-semibold')}>{config?.label}</span>
              {isActive && <CheckIcon className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
