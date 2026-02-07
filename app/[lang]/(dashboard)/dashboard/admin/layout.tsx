import AdminSidebar from '@/components/dashboard/admin-sidebar'
import DashboardHeader from '@/components/dashboard/dashboard-header'
import { PropsWithChildren } from 'react'

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  )
}
