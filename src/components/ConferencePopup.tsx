'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

interface ConferencePopupProps {
  trigger?: boolean
}

export const ConferencePopup = ({ trigger }: ConferencePopupProps) => {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Check if user has opted out for the day
    const lastClosed = localStorage.getItem('conference_popup_closed')
    const today = new Date().toDateString()
    if (lastClosed === today) return

    // If trigger is provided and true, show immediately
    if (trigger) {
      setIsVisible(true)
    } else if (trigger === undefined) {
      // Fallback: use timer if no trigger is controlled by parent
      const timer = setTimeout(() => setIsVisible(true), 2800)
      return () => clearTimeout(timer)
    }
  }, [trigger])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      setIsClosing(false)
    }, 300)
  }

  const handleDontShowToday = () => {
    const today = new Date().toDateString()
    localStorage.setItem('conference_popup_closed', today)
    handleClose()
  }

  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className={`relative max-h-[calc(100dvh-5rem)] w-full max-w-[420px] overflow-hidden rounded-[2rem] border border-white/40 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] animate-in zoom-in-95 fade-in duration-500 transition-transform ${isClosing ? 'scale-95' : 'scale-100'}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-brand-purple">
          <img
            src="/images/pf-conf-2026-banner.jpg"
            alt="PassionFruits Conference 2026 poster"
            className="h-full w-full object-cover"
          />

          {/* Close Button */}
          <button
            onClick={handleClose}
            aria-label="Close conference banner"
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-brand-dark shadow-lg backdrop-blur transition-all hover:bg-white"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="bg-white p-4 sm:p-5">
          <Link
            href="/conference/register"
            onClick={handleClose}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-dark px-6 py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_10px_24px_rgba(18,28,42,0.18)] transition-all hover:-translate-y-0.5 hover:bg-brand-purple active:scale-95"
          >
            Join Now
            <span className="material-icons text-lg" aria-hidden="true">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* "Do Not Show Again" Button (Below the Card, Centered) */}
      <button 
        onClick={handleDontShowToday}
        className="mt-6 relative z-10 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 hover:text-white transition-all animate-in slide-in-from-top-4 fade-in duration-700"
      >
        {t('popup.hideToday')}
      </button>
    </div>
  )
}
