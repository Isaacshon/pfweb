'use client'

import React from 'react'
import { useLanguage } from '@/context/LanguageContext'

export const ScheduleTable = () => {
  const { t } = useLanguage()

  const schedule = [
    { name: t('schedule.mon'), time: 'Mon 7:30 PM', location: 'Toronto Hub' },
    { name: t('schedule.sun'), time: 'Sun 2:00 PM', location: 'Main Hall' },
    { name: t('schedule.sat'), time: 'Sat 6:00 PM', location: 'Culture Room' },
    { name: t('schedule.thu'), time: 'Thu 7:00 PM', location: 'Studio' },
  ]

  return (
    <div id="schedule" className="bg-white py-32 px-6 border-b-8 border-brand-dark">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div>
          <h2 className="text-6xl md:text-7xl font-black text-brand-dark mb-10 leading-[0.9] uppercase tracking-tighter">
            {t('schedule.title')}<br/><span className="text-brand-purple">{t('schedule.subtitle')}</span>
          </h2>
          <p className="text-xl text-slate-500 mb-12 max-w-md font-bold">
            {t('schedule.desc')}
          </p>
          <a 
            href="/contact" 
            className="inline-block px-16 py-6 bg-brand-yellow text-brand-dark border-4 border-brand-dark rounded-3xl font-black text-xl uppercase shadow-[8px_8px_0px_#1a1a1a] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-center"
          >
            {t('schedule.cta')}
          </a>
        </div>
        
        <div className="bg-white border-4 border-brand-dark rounded-[2.5rem] p-10 md:p-14 shadow-[12px_12px_0px_#1a1a1a]">
          <div className="space-y-10">
            {schedule.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row md:justify-between md:items-center border-b-4 border-brand-dark/5 pb-10 last:border-0 last:pb-0 gap-6">
                <div>
                  <h4 className="font-black text-3xl text-brand-dark mb-2 uppercase tracking-tight">{item.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-brand-purple text-sm">place</span>
                    <p className="text-sm text-brand-purple font-black uppercase tracking-[0.2em]">{item.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:text-right">
                  <span className="material-icons text-brand-dark/20 hidden md:block">access_time</span>
                  <span className="inline-block px-8 py-2 bg-brand-dark text-white rounded-full text-base font-black uppercase tracking-widest shadow-lg">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
