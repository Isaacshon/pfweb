"use client"

import React from 'react'
import { useTheme } from '@/context/ThemeContext'
import Link from 'next/link'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

type InstallContext = {
  isAndroid: boolean
  isIOS: boolean
  isSafari: boolean
  isStandalone: boolean
}

const fallbackInviteUrl = "https://passionfruits.ca/app/download?install=1"

const getInstallContext = (): InstallContext => {
  if (typeof window === 'undefined') {
    return { isAndroid: false, isIOS: false, isSafari: false, isStandalone: false }
  }

  const userAgent = window.navigator.userAgent
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean }
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isAndroid = /Android/i.test(userAgent)
  const isSafari = /^((?!CriOS|FxiOS|EdgiOS|Chrome|Chromium|Android).)*Safari/i.test(userAgent)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true

  return { isAndroid, isIOS, isSafari, isStandalone }
}

const isInviteInstallRequest = () => {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  return params.get('install') === '1'
}

const copyToClipboard = async (text: string) => {
  if (!navigator.clipboard) {
    throw new Error('Clipboard is not available')
  }

  await navigator.clipboard.writeText(text)
}

export default function DownloadPage() {
  const { isDarkMode } = useTheme()
  const [appUrl, setAppUrl] = React.useState(fallbackInviteUrl)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(appUrl)}&color=000000&bgcolor=ffffff`

  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow text-black' : 'bg-brand-purple text-white'
  const activeBorder = isDarkMode ? 'border-brand-yellow' : 'border-brand-purple'

  const [installPrompt, setInstallPrompt] = React.useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallSheet, setShowInstallSheet] = React.useState(false)
  const [installContext, setInstallContext] = React.useState<InstallContext>({
    isAndroid: false,
    isIOS: false,
    isSafari: false,
    isStandalone: false,
  })

  React.useEffect(() => {
    const context = getInstallContext()
    setInstallContext(context)
    setAppUrl(`${window.location.origin}/app/download?install=1`)

    if (isInviteInstallRequest() && !context.isStandalone) {
      const timer = window.setTimeout(() => setShowInstallSheet(true), 450)
      return () => window.clearTimeout(timer)
    }
  }, [])

  React.useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault()
      const promptEvent = event as BeforeInstallPromptEvent
      setInstallPrompt(promptEvent)

      if (isInviteInstallRequest() && !getInstallContext().isStandalone) {
        setShowInstallSheet(true)
      }
    }

    const handleInstalled = () => {
      setInstallPrompt(null)
      setShowInstallSheet(false)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  React.useEffect(() => {
    if (installPrompt && isInviteInstallRequest() && !installContext.isStandalone) {
      setShowInstallSheet(true)
    }
  }, [installPrompt, installContext.isStandalone])

  const handleInstallClick = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setShowInstallSheet(false)
    }
    setInstallPrompt(null)
  }

  const handleShareInvite = async () => {
    const shareData = {
      title: 'PassionFruits',
      text: 'Install PassionFruits and join our community.',
      url: appUrl,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // Share cancellation should not show an error.
      }
      return
    }

    try {
      await copyToClipboard(appUrl)
      alert("Invite link copied to clipboard!")
    } catch {
      window.prompt("Copy this invite link:", appUrl)
    }
  }

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
            Install Link
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-4">
          {(installPrompt || installContext.isIOS) && !installContext.isStandalone && (
            <button 
              onClick={() => {
                if (installPrompt) {
                  handleInstallClick()
                } else {
                  setShowInstallSheet(true)
                }
              }}
              className={`w-full py-5 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-xl bg-white text-black border-2 ${activeBorder} animate-bounce mb-4`}
            >
              {installPrompt ? 'Install App Now' : 'Show iOS Install Steps'}
            </button>
          )}

          <button 
            onClick={handleShareInvite}
            className={`w-full py-5 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-xl ${accentBg}`}
          >
            Invite Friends
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
                <p className="text-xs text-zinc-500 leading-relaxed">Open in Safari → Tap Share →<br/>Select Add to Home Screen</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'}`}>
                <span className="material-icons text-xl">android</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold">Android</p>
                <p className="text-xs text-zinc-500 leading-relaxed">Open the invite link in Chrome →<br/>Tap Install App Now</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showInstallSheet && !installContext.isStandalone && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 backdrop-blur-sm px-4 pb-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-[40px] border p-7 shadow-2xl ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-100 text-zinc-950'} animate-in slide-in-from-bottom-6 duration-300`}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center ${accentBg} shadow-lg`}>
                  <span className="material-icons text-2xl">add_to_home_screen</span>
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.28em] ${accentColor}`}>PassionFruits App</p>
                  <h2 className="text-2xl font-black tracking-tight">Install to Home Screen</h2>
                </div>
              </div>
              <button
                onClick={() => setShowInstallSheet(false)}
                className="w-10 h-10 rounded-full bg-zinc-500/10 flex items-center justify-center active:scale-90 transition-transform"
                aria-label="Close install prompt"
              >
                <span className="material-icons text-lg">close</span>
              </button>
            </div>

            {installPrompt ? (
              <div className="space-y-5">
                <p className="text-sm text-zinc-500 font-bold leading-relaxed">
                  Keep PassionFruits on your phone like an app. The next step will open your browser&apos;s install dialog.
                </p>
                <button
                  onClick={handleInstallClick}
                  className={`w-full py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl ${accentBg} active:scale-[0.98] transition-transform`}
                >
                  Install on this device
                </button>
              </div>
            ) : installContext.isIOS ? (
              <div className="space-y-5">
                {!installContext.isSafari && (
                  <div className="rounded-[24px] bg-brand-yellow/20 border border-brand-yellow/30 p-4 text-xs font-bold leading-relaxed text-zinc-600">
                    On iPhone, open this invite link in Safari first for the Home Screen option.
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { icon: 'share', label: 'Tap Share' },
                    { icon: 'add_box', label: 'Add to Home' },
                    { icon: 'done', label: 'Tap Add' },
                  ].map((step, index) => (
                    <div key={step.label} className={`rounded-[24px] p-4 ${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'}`}>
                      <div className={`mx-auto mb-3 w-10 h-10 rounded-2xl flex items-center justify-center ${index === 1 ? accentBg : 'bg-white text-zinc-900'}`}>
                        <span className="material-icons text-xl">{step.icon}</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{step.label}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={async () => {
                    try {
                      await copyToClipboard(appUrl)
                      alert('Invite link copied. Open it in Safari if needed.')
                    } catch {
                      window.prompt('Copy this invite link:', appUrl)
                    }
                  }}
                  className={`w-full py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-slate-100 text-zinc-900'}`}
                >
                  Copy Invite Link
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-sm text-zinc-500 font-bold leading-relaxed">
                  If the install button is not available yet, open this link in Chrome and use the browser menu to install the app.
                </p>
                <button
                  onClick={() => setShowInstallSheet(false)}
                  className={`w-full py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl ${accentBg}`}
                >
                  Continue in Browser
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
