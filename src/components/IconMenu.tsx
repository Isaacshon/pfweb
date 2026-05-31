'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export const IconMenu = ({ items }: { items?: any[] }) => {
  const { t, language } = useLanguage()

  const defaultItems = [
    { icon: 'event', label: t('menu.conf'), subLabel: t('menu.confSub'), href: '/conference' },
    { icon: 'campaign', label: t('menu.events'), subLabel: t('menu.eventsSub'), href: '/events' },
    { icon: 'groups', label: t('menu.about'), subLabel: t('menu.aboutSub'), href: '/about' },
    { icon: 'visibility', label: t('menu.vision'), subLabel: t('menu.visionSub'), href: '/about' },
    { icon: 'mail', label: t('menu.contact'), subLabel: t('menu.contactSub'), href: '/contact' },
    { icon: 'favorite', label: t('menu.support'), subLabel: t('menu.supportSub'), href: '/contact' },
  ]

  const menuItems = language === 'en' && items ? items : defaultItems

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 py-12 md:py-20 px-4 max-w-7xl mx-auto place-items-stretch">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="flex min-h-[132px] w-full flex-col items-center justify-start text-center group transition-all"
        >
          <div className="w-20 h-20 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md group-hover:border-brand-purple transition-all overflow-hidden">
            {item.iconUrl ? (
              <img src={item.iconUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.label} />
            ) : (
              <span className="material-icons text-brand-purple/70 group-hover:text-brand-purple text-3xl">
                {item.icon}
              </span>
            )}
          </div>
          <span className="flex min-h-5 items-center justify-center text-sm font-bold text-slate-800 tracking-tight leading-tight break-keep">{item.label}</span>
          <span className="mt-1 flex min-h-4 items-center justify-center text-[10px] text-slate-400 font-medium uppercase tracking-wider leading-tight break-keep">{item.subLabel}</span>
        </Link>
      ))}
    </div>
  )
}
