'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LanguageMenu } from '@/components/language-menu'
import { cn } from '@/lib/utils/shadcn.utils'

interface LangSwitchProps {
  isTransparent?: boolean
}

export default function LangSwitch({ isTransparent }: LangSwitchProps) {
  return (
    <LanguageMenu.Provider>
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
            <LanguageMenu.TriggerLabel />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          <LanguageMenu.Items />
        </DropdownMenuContent>
      </DropdownMenu>
    </LanguageMenu.Provider>
  )
}
