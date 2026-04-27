"use client"

import React from 'react'
import { useTheme } from '@/context/ThemeContext'
import Link from 'next/link'

export default function DownloadPage() {
  const { isDarkMode } = useTheme()
  const appUrl = "https://passionfruits.ca/app"
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(appUrl)}&color=000000&bgcolor=ffffff`

  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow text-black' : 'bg-brand-purple text-white'
  const activeBorder = isDarkMode ? 'border-brand-yellow' : 'border-brand-purple'

  const [installPrompt, setInstallPrompt] = React.useState<any>(null)

  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} pb-40 transition-colors duration-500`}>
      {/* Header */}
      <header className="px-8 pt-20 pb-12 flex items-center justify-between">
        <Link href="/app/profile" className="w-12 h-12 rounded-full flex items-center justify-center bg-zinc-500/10 active:scale-90 transition-transform">
          <span className="material-icons">arrow_back</span>
        </Link>
        <h1 className="text-2xl font-black font-plus-jakarta tracking-tight">Share App</h1>
        <div className="w-12"></div>
      </header>

      <section className="px-8 flex flex-col items-center text-center gap-12">
        {/* Value Proposition */}
        <div className="space-y-2">
          <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${accentColor}`}>Join the Community</p>
          <h2 className="text-4xl font-black font-plus-jakarta tracking-tighter leading-none">
            Invite your<br/>Friends
          </h2>
        </div>

        {/* Live Functional QR Code */}
        <div className={`p-8 rounded-[56px] ${isDarkMode ? 'bg-white shadow-2xl shadow-brand-yellow/10' : 'bg-slate-50 border border-slate-100'} relative`}>
          <div className="w-64 h-64 flex items-center justify-center">
            <img 
              src={qrUrl} 
              alt="Download QR Code" 
              className="w-full h-full mix-blend-multiply"
            />
          </div>
          {/* Decorative Corner Labels */}
          <div className="absolute -top-3 -right-3 px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-xl">
            Scan to Join
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-4">
          {installPrompt && (
            <button 
              onClick={handleInstallClick}
              className={`w-full py-5 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-xl bg-white text-black border-2 ${activeBorder} animate-bounce mb-4`}
            >
              Install App Now
            </button>
          )}

          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'PassionFruits', text: 'Join our radiant church community!', url: appUrl })
              } else {
                navigator.clipboard.writeText(appUrl);
                alert("App URL copied to clipboard!");
              }
            }}
            className={`w-full py-5 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-xl ${accentBg}`}
          >
            Share Link Directly
          </button>
          
          <div className="h-px w-full bg-zinc-500/10 my-4"></div>

          {/* Installation Guide */}
          <div className="space-y-6 text-left w-full px-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">How to Install</p>
            
            <div className="flex gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'}`}>
                <span className="material-icons text-xl">apple</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold">iOS (iPhone)</p>
                <p className="text-xs text-zinc-500 leading-relaxed">Open in Safari → Tap 'Share' icon →<br/>Select 'Add to Home Screen'</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'}`}>
                <span className="material-icons text-xl">android</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold">Android</p>
                <p className="text-xs text-zinc-500 leading-relaxed">Open in Chrome → Tap 'Three Dots' →<br/>Select 'Install App' or 'Add to Home'</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
