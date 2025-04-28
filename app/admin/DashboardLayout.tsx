import React from 'react'
import  Sidebar  from './Sidebar'
interface DashboardLayoutProps {
  children: React.ReactNode
}
 function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  )
}
export default DashboardLayout