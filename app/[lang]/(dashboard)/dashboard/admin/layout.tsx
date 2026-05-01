import AdminSidebar from '@/components/dashboard/admin-sidebar'
import DashboardHeader from '@/components/dashboard/dashboard-header'
import { requireRole } from '@/lib/utils/auth.utils'
import type { PageParamsProps } from '@/lib/types/page.type'
import { PropsWithChildren } from 'react'

export default async function AdminLayout({ children, params }: PageParamsProps & PropsWithChildren) {
  const { lang } = await params
  await requireRole(lang, ['ADMIN'])

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="overflow-y-auto flex-1 px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  )
}
