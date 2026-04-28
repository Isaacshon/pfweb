"use client"

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/context/ThemeContext'

function AttendanceContent() {
  const { isDarkMode } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const date = searchParams.get('date')

  const [status, setStatus] = useState<'loading' | 'success' | 'already_collected' | 'error' | 'not_logged_in'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!date) {
      setStatus('error')
      setErrorMessage('Invalid QR Code. No date provided.')
      return
    }

    const checkAttendance = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setStatus('not_logged_in')
        return
      }

      const userId = session.user.id

      try {
        const { error } = await supabase
          .from('attendance')
          .insert({ user_id: userId, date: date })

        if (error) {
          if (error.code === '23505') { // Unique violation
            setStatus('already_collected')
          } else {
            setStatus('error')
            setErrorMessage(error.message)
          }
        } else {
          setStatus('success')
        }
      } catch (err: any) {
        setStatus('error')
        setErrorMessage(err.message)
      }
    }

    checkAttendance()
  }, [date])

  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-[#F8FAFC]'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const cardBg = isDarkMode ? 'bg-zinc-900/40 border-zinc-500/10' : 'bg-white border-slate-200'

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} flex flex-col items-center justify-center p-6 text-center font-pretendard transition-colors duration-500`}>
      <div className={`p-10 rounded-[40px] border ${cardBg} max-w-sm w-full flex flex-col items-center gap-6 shadow-2xl`}>
        
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-[#9a78b4] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-black uppercase tracking-widest opacity-50">Verifying...</p>
          </>
        )}

        {status === 'not_logged_in' && (
          <>
            <div className="w-20 h-20 rounded-full bg-zinc-500/10 flex items-center justify-center mb-2">
              <span className="material-icons text-4xl opacity-50">lock</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Please Log In</h2>
            <p className="text-sm opacity-60">You must be logged in to collect attendance badges.</p>
            <button 
              onClick={() => router.push('/app/profile')}
              className="mt-4 w-full py-4 rounded-full bg-[#9a78b4] text-white font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-lg"
            >
              Go to Profile / Login
            </button>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 animate-pulse rounded-full"></div>
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-yellow-500 to-[#9a78b4] flex items-center justify-center shadow-xl animate-in zoom-in duration-500 relative z-10 border-4 border-white/20">
                <span className="material-icons text-6xl text-white">workspace_premium</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-[#9a78b4] mb-2">Badge Earned!</h2>
              <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-1">{date}</p>
              <p className="text-sm opacity-80">You successfully attended worship today.</p>
            </div>
            <button 
              onClick={() => router.push('/app/profile')}
              className="mt-4 w-full py-4 rounded-full bg-zinc-900 text-white font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
            >
              View My Collection
            </button>
          </>
        )}

        {status === 'already_collected' && (
          <>
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-500/50">
              <span className="material-icons text-4xl text-green-500">check_circle</span>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight mb-2">Already Collected</h2>
              <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-1">{date}</p>
              <p className="text-sm opacity-80">You already have the badge for today.</p>
            </div>
            <button 
              onClick={() => router.push('/app/profile')}
              className="mt-4 w-full py-4 rounded-full bg-zinc-900 text-white font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
            >
              Back to Profile
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
              <span className="material-icons text-4xl">error_outline</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-red-500">Oops!</h2>
            <p className="text-sm opacity-60 text-red-400/80">{errorMessage}</p>
            <button 
              onClick={() => router.push('/app')}
              className="mt-4 w-full py-4 rounded-full bg-zinc-900 text-white font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
            >
              Return Home
            </button>
          </>
        )}

      </div>
      <style jsx global>{` .font-pretendard { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; } `}</style>
    </div>
  )
}

export default function AttendancePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#9a78b4] border-t-transparent rounded-full animate-spin"></div></div>}>
      <AttendanceContent />
    </Suspense>
  )
}
