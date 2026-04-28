"use client"

import React, { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useRouter } from 'next/navigation'

interface SetList {
  id: string
  date: string
  title: string
  songs: { title: string, artist: string, key?: string, link?: string }[]
  notes?: string
}

const initialSets: SetList[] = [
  {
    id: '1',
    date: '2026-05-03',
    title: 'Sunday Worship Service',
    songs: [
      { title: 'Way Maker', artist: 'Leeland', key: 'E', link: 'https://youtube.com/watch?v=iJCV_2H9xD0' },
      { title: 'Goodness of God', artist: 'Bethel Music', key: 'Ab', link: 'https://youtube.com/watch?v=-f4MUUMWMK4' },
      { title: 'The Blessing', artist: 'Elevation Worship', key: 'B', link: 'https://youtube.com/watch?v=Zp6aygmvzM4' }
    ],
    notes: 'Please focus on the bridge transition for Way Maker.'
  }
]

export default function WorshipPage() {
  const { isDarkMode } = useTheme()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [sets, setSets] = useState<SetList[]>(initialSets)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedSet, setSelectedSet] = useState<SetList | null>(null)

  // New Set Form
  const [newDate, setNewDate] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newNotes, setNewNotes] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('pf_current_user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setCurrentUser(user)
      if (user.role !== 'leader' && user.role !== 'worship_team') {
        router.push('/app')
      }
    } else {
      router.push('/app/profile')
    }

    const savedSets = localStorage.getItem('pf_worship_sets')
    if (savedSets) setSets(JSON.parse(savedSets))
    setIsLoaded(true)
  }, [])

  const addSet = () => {
    const newSet: SetList = {
      id: Date.now().toString(),
      date: newDate,
      title: newTitle,
      songs: [],
      notes: newNotes
    }
    const next = [newSet, ...sets]
    setSets(next)
    localStorage.setItem('pf_worship_sets', JSON.stringify(next))
    setIsAddModalOpen(false)
  }

  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const accentColor = isDarkMode ? 'text-brand-yellow' : 'text-brand-purple'
  const accentBg = isDarkMode ? 'bg-brand-yellow text-black' : 'bg-brand-purple text-white'
  const cardBg = isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-100'

  if (!isLoaded || !currentUser) return null

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} pb-40 transition-colors duration-500 font-pretendard`}>
      <header className="px-6 pt-20 pb-8 flex items-center justify-between sticky top-0 z-40 bg-inherit/80 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Worship</h1>
          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em]">Set List & Practice</p>
        </div>
        {(currentUser.role === 'leader' || currentUser.role === 'worship_team') && (
          <button onClick={() => setIsAddModalOpen(true)} className={`w-10 h-10 rounded-full flex items-center justify-center ${accentBg} shadow-lg active:scale-90 transition-all`}>
            <span className="material-icons">add</span>
          </button>
        )}
      </header>

      <section className="px-6 space-y-6">
        {sets.map(set => (
          <div key={set.id} onClick={() => setSelectedSet(set)} className={`p-8 rounded-[40px] border ${cardBg} transition-all active:scale-[0.98] cursor-pointer`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${accentColor} mb-2`}>{set.date}</p>
                <h3 className="text-xl font-black tracking-tight">{set.title}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-500/10">
                <span className="material-icons text-zinc-400">chevron_right</span>
              </div>
            </div>
            <div className="flex gap-2">
              {set.songs.slice(0, 3).map((s, i) => (
                <div key={i} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${isDarkMode ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-slate-400'}`}>
                  {s.title}
                </div>
              ))}
              {set.songs.length > 3 && <div className="text-[9px] font-black opacity-20">+{set.songs.length - 3}</div>}
            </div>
          </div>
        ))}
      </section>

      {/* Set Details Modal */}
      {selectedSet && (
        <div className={`fixed inset-0 z-[100] flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500 ${bgColor}`}>
          <header className="px-6 pt-16 pb-6 flex items-center justify-between border-b border-zinc-500/10">
            <button onClick={() => setSelectedSet(null)} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-500/10"><span className="material-icons text-xl">close</span></button>
            <h2 className="text-sm font-black uppercase tracking-widest opacity-40">Set Details</h2>
            <div className="w-10"></div>
          </header>
          <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12 no-scrollbar">
            <div>
              <p className={`text-xs font-black uppercase tracking-[0.3em] ${accentColor} mb-3`}>{selectedSet.date}</p>
              <h2 className="text-4xl font-black tracking-tighter leading-tight mb-4">{selectedSet.title}</h2>
              {selectedSet.notes && <p className="text-sm opacity-50 leading-relaxed font-medium">{selectedSet.notes}</p>}
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Songs List</h3>
              <div className="space-y-4">
                {selectedSet.songs.map((song, i) => (
                  <div key={i} className={`p-6 rounded-[32px] border ${cardBg} flex items-center justify-between group`}>
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${isDarkMode ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-slate-300'}`}>
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-lg font-black tracking-tight">{song.title}</h4>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{song.artist} • <span className={accentColor}>{song.key} Key</span></p>
                      </div>
                    </div>
                    {song.link && (
                      <a href={song.link} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-800' : 'bg-white'} shadow-md active:scale-90 transition-all`}>
                        <span className="material-icons text-xl">play_arrow</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Set Modal */}
      {isAddModalOpen && (
        <div className={`fixed inset-0 z-[110] flex flex-col animate-in fade-in zoom-in duration-300 ${bgColor}`}>
          <header className="px-6 pt-16 pb-6 flex items-center justify-between border-b border-zinc-500/10">
            <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-500/10"><span className="material-icons text-xl">close</span></button>
            <h2 className="text-sm font-black uppercase tracking-widest opacity-40">Add New Set</h2>
            <button onClick={addSet} className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest ${accentBg} shadow-lg active:scale-90 transition-all`}>Create</button>
          </header>
          <div className="flex-1 overflow-y-auto px-8 py-10 space-y-8 no-scrollbar">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-30 pl-2">Date</p>
              <input type="date" value={newDate} onChange={(e)=>setNewDate(e.target.value)} className={`w-full p-6 rounded-[24px] outline-none font-bold ${cardBg} border`} />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-30 pl-2">Title</p>
              <input type="text" placeholder="e.g. Sunday Service" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} className={`w-full p-6 rounded-[24px] outline-none font-bold ${cardBg} border`} />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-30 pl-2">Notes</p>
              <textarea placeholder="Any instructions for the team?" value={newNotes} onChange={(e)=>setNewNotes(e.target.value)} className={`w-full h-40 p-6 rounded-[32px] outline-none font-bold ${cardBg} border resize-none`} />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{` .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .font-pretendard { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; } `}</style>
    </div>
  )
}
