'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface ConferencePopupProps {
  trigger?: boolean
}

export const ConferencePopup = ({ trigger }: ConferencePopupProps) => {
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
      <div className={`relative w-full max-w-[400px] aspect-[3/4] bg-white rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 fade-in duration-500 transition-transform ${isClosing ? 'scale-95' : 'scale-100'} border-8 border-brand-dark`}>
        
        {/* Full-bleed Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
            alt="Conference 2026"
            className="w-full h-full object-cover"
          />
          {/* Very Dark Overlay for High Visibility */}
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Close Button (High Contrast) */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-brand-yellow text-brand-dark flex items-center justify-center hover:bg-white transition-all border-4 border-brand-dark shadow-lg"
        >
          <span className="material-symbols-outlined font-black">close</span>
        </button>

        {/* Content (High Contrast Center) */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8">
          <div className="mt-auto">
            <span className="inline-block px-4 py-1 bg-brand-yellow text-brand-dark rounded-full text-xs font-black uppercase tracking-widest mb-6 border-2 border-brand-dark shadow-md">
              Special Event
            </span>
            <h3 className="text-3xl font-black text-white mb-4 leading-tight uppercase tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
              PassionFruits<br/>Conference 2026
            </h3>
            <p className="text-white text-sm mb-10 leading-relaxed max-w-[280px] mx-auto font-bold drop-shadow-md">
              Kingdom Influence: Leading a youth culture that is as trendy as it is transformative. Join the movement.
            </p>
            <Link 
              href="/conference" 
              onClick={handleClose}
              className="block w-full py-4 bg-brand-yellow text-brand-dark rounded-2xl font-black text-sm uppercase shadow-[0_8px_0px_#1a1a1a] hover:translate-y-1 hover:shadow-[0_4px_0px_#1a1a1a] transition-all active:scale-95 mb-6"
            >
              Register Now
            </Link>
            <Link 
              href="/conference"
              onClick={handleClose}
              className="text-white font-black text-xs uppercase hover:text-brand-yellow transition-colors underline underline-offset-4 tracking-widest"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* "Do Not Show Again" Button (Below the Card, Centered) */}
      <button 
        onClick={handleDontShowToday}
        className="mt-6 relative z-10 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 hover:text-white transition-all animate-in slide-in-from-top-4 fade-in duration-700"
      >
        Do not show this again today
      </button>
    </div>
  )
}
