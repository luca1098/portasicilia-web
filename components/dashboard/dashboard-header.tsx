'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useTranslation } from '@/lib/context/translation.context'
import { BellIcon, ChevronDownIcon, LogOutIcon } from '@/lib/constants/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LanguageMenu } from '@/components/language-menu'
import { cn } from '@/lib/utils/shadcn.utils'

const ROLE_KEYS: Record<string, string> = {
  ADMIN: 'role_admin',
  OWNER: 'role_owner',
  USER: 'role_user',
}

export default function DashboardHeader({ children }: { children?: React.ReactNode }) {
  const { data: session } = useSession()
  const t = useTranslation() as Record<string, string>

  const user = session?.user
  const displayName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email : ''
  const initials = user
    ? `${user.firstName?.charAt(0) ?? ''}${user.lastName?.charAt(0) ?? ''}`.toUpperCase() || '?'
    : ''
  const roleLabel = user ? (t[ROLE_KEYS[user.role]] ?? user.role) : ''

  const handleLogout = () => {
    signOut()
  }

  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border bg-background px-6 lg:px-10">
      {children && <div className="flex items-center gap-3">{children}</div>}
      <div className="flex-1" />
      {/* Bell icon */}
      <button className="relative mr-4 text-muted-foreground transition-colors hover:text-foreground">
        <BellIcon className="size-5" />
        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-destructive" />
      </button>

      {/* User card */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent">
            <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={displayName}
                  width={36}
                  height={36}
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold text-primary">{initials}</span>
              )}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium leading-tight">{displayName}</p>
              <p className="text-xs leading-tight text-muted-foreground">{roleLabel}</p>
            </div>
            <ChevronDownIcon className="hidden size-4 text-muted-foreground md:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <LanguageMenu.SubMenu label={t.dashboard_menu_language} />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleLogout}
            className={cn(
              'flex items-center gap-2 text-sm font-normal text-destructive focus:text-destructive'
            )}
          >
            <LogOutIcon className="size-4" />
            {t.logout}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
