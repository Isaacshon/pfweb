'use client'

import React from 'react'

const schedule = [
  { name: 'Passion Worship', time: 'Every Sunday 2:00 PM', location: 'Main Hall' },
  { name: 'Youth Gathering', time: 'Sat 6:00 PM', location: 'Culture Room' },
  { name: 'Morning Prayer', time: 'Mon-Fri 6:00 AM', location: 'Online' },
  { name: 'Creative Lab', time: 'Thu 7:00 PM', location: 'Studio' },
]

export const ScheduleTable = () => {
  return (
    <div className="bg-slate-50 py-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-brand-purple mb-6 leading-tight">
            PassionFruits<br/>Ministry Schedule
          </h2>
          <p className="text-slate-500 mb-8 max-w-md">
            Our ministries are filled with creative language and passion. Find your place.
          </p>
          <button className="px-8 py-3 bg-brand-yellow text-slate-900 rounded-full font-bold shadow-lg">
            Add to Calendar
          </button>
        </div>
        
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="space-y-8">
            {schedule.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                <div>
                  <h4 className="font-black text-xl text-slate-800 mb-1">{item.name}</h4>
                  <p className="text-sm text-slate-400">{item.location}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-4 py-1 bg-brand-purple/5 text-brand-purple rounded-full text-sm font-bold">
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
