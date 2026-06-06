'use client'

import React from 'react'
import { useLanguage } from '@/context/LanguageContext'

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage()

  const langs = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'ko', label: 'KR', name: 'Korean' },
    { code: 'zh', label: 'CN', name: 'Chinese' },
    { code: 'es', label: 'ES', name: 'Spanish' },
  ] as const

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
      {langs.map((lang) => (
        <button
          type="button"
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          aria-label={`Switch language to ${lang.name}`}
          aria-pressed={language === lang.code}
          className={`
            min-h-11 min-w-11 rounded-full px-3 text-center text-[10px] font-black transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/25
            ${language === lang.code 
              ? 'bg-brand-purple text-white shadow-sm' 
              : 'text-slate-600 hover:text-brand-purple'
            }
          `}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
