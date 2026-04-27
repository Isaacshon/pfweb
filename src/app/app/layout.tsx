import React from 'react'
import { AppNavBar } from '@/components/AppNavBar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white text-[#121c2a] font-['Plus_Jakarta_Sans'] antialiased">
      <main className="flex-1 w-full max-w-md mx-auto relative overflow-y-auto overflow-x-hidden no-scrollbar">
        {children}
      </main>
      <AppNavBar />
    </div>
  )
}
