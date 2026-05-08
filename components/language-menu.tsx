'use client'

import { createContext, use, type ReactNode } from 'react'
import { usePathname, useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { CheckIcon, LanguagesIcon } from '@/lib/constants/icons'
import { supportedLocales, type SupportedLocale } from '@/lib/configs/locales'
import { api } from '@/lib/api/fetch-client'
import { cn } from '@/lib/utils/shadcn.utils'

const localeConfig: Record<SupportedLocale, { flag: string; label: string }> = {
  it: { flag: '🇮🇹', label: 'ITA' },
  en: { flag: '🇬🇧', label: 'ENG' },
  es: { flag: '🇪🇸', label: 'ESP' },
  fr: { flag: '🇫🇷', label: 'FRA' },
  de: { flag: '🇩🇪', label: 'DEU' },
}

export function getLocaleConfig(locale: SupportedLocale) {
  return localeConfig[locale]
}

interface LanguageMenuContextValue {
  state: { currentLang: SupportedLocale }
  actions: { select: (lang: SupportedLocale) => Promise<void> }
}

const LanguageMenuContext = createContext<LanguageMenuContextValue | null>(null)

function useLanguageMenuContext(part: string) {
  const ctx = use(LanguageMenuContext)
  if (!ctx) throw new Error(`LanguageMenu.${part} must be used within LanguageMenu.Provider`)
  return ctx
}

interface LanguageMenuProviderProps {
  children: ReactNode
  onSelect?: () => void
}

function LanguageMenuProvider({ children, onSelect }: LanguageMenuProviderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const { data: session } = useSession()
  const currentLang = params.lang as SupportedLocale

  const select = async (lang: SupportedLocale) => {
    onSelect?.()
    if (lang === currentLang) return

    const newPath = pathname.replace(`/${currentLang}`, `/${lang}`)
    router.push(newPath)

    if (session?.accessToken) {
      try {
        await api.patch('/users/me/lang', { lang: lang.toUpperCase() })
      } catch (error) {
        // Non-blocking: URL already changed.
        console.error('Failed to persist language preference', error)
      }
    }
  }

  return (
    <LanguageMenuContext value={{ state: { currentLang }, actions: { select } }}>
      {children}
    </LanguageMenuContext>
  )
}

function LanguageMenuItems() {
  const {
    state: { currentLang },
    actions: { select },
  } = useLanguageMenuContext('Items')

  return (
    <>
      {supportedLocales.map(lang => {
        const config = localeConfig[lang]
        const isActive = lang === currentLang
        return (
          <DropdownMenuItem
            key={lang}
            onSelect={event => {
              event.preventDefault()
              select(lang)
            }}
            className="flex items-center gap-2 text-sm"
          >
            <span className="text-base leading-none">{config.flag}</span>
            <span className={cn('font-medium', isActive && 'font-semibold')}>{config.label}</span>
            {isActive && <CheckIcon className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        )
      })}
    </>
  )
}

function LanguageMenuTriggerLabel() {
  const {
    state: { currentLang },
  } = useLanguageMenuContext('TriggerLabel')
  const config = localeConfig[currentLang]

  return (
    <>
      <span className="text-base leading-none">{config?.flag}</span>
      <span>{config?.label ?? currentLang.toUpperCase()}</span>
    </>
  )
}

interface LanguageMenuSubMenuProps {
  label: string
}

function LanguageMenuSubMenu({ label }: LanguageMenuSubMenuProps) {
  return (
    <LanguageMenuProvider>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="flex items-center gap-2 text-sm">
          <LanguagesIcon className="size-4" />
          <span>{label}</span>
          <SubTriggerCurrent />
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-40">
          <LanguageMenuItems />
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </LanguageMenuProvider>
  )
}

function SubTriggerCurrent() {
  const {
    state: { currentLang },
  } = useLanguageMenuContext('SubTriggerCurrent')
  const config = localeConfig[currentLang]

  return (
    <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
      <span className="text-sm leading-none">{config?.flag}</span>
      <span>{config?.label ?? currentLang.toUpperCase()}</span>
    </span>
  )
}

export const LanguageMenu = {
  Provider: LanguageMenuProvider,
  Items: LanguageMenuItems,
  TriggerLabel: LanguageMenuTriggerLabel,
  SubMenu: LanguageMenuSubMenu,
}
