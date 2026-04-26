import React from 'react'
import { AppNavBar } from '@/components/AppNavBar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9ff] text-[#121c2a] font-['Plus_Jakarta_Sans'] antialiased">
      <main className="flex-1 w-full max-w-md mx-auto relative pb-28">
        {children}
      </main>
      <AppNavBar />
    </div>
  )
}
