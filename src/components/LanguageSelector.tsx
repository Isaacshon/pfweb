'use client'

import React from 'react'
import { useLanguage } from '@/context/LanguageContext'

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage()

  const langs = [
    { code: 'en', label: 'EN' },
    { code: 'ko', label: 'KR' },
    { code: 'zh', label: 'CN' },
    { code: 'es', label: 'ES' },
  ] as const

  return (
    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-full border border-slate-200">
      {langs.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`
            px-3 py-1 rounded-full text-[10px] font-black transition-all
            ${language === lang.code 
              ? 'bg-brand-purple text-white shadow-sm' 
              : 'text-slate-400 hover:text-brand-purple'
            }
          `}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
