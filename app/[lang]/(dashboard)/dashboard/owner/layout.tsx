import OwnerSidebar from '@/components/dashboard/owner-sidebar'
import DashboardHeader from '@/components/dashboard/dashboard-header'
import { PropsWithChildren } from 'react'

export default function OwnerLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen overflow-hidden">
      <OwnerSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="overflow-y-auto flex-1 px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  )
}
