"use client"

import React, { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Song {
  title: string
  artist: string
  key: string
  link: string
  sheetUrl?: string
}

interface TeamMember {
  userId: string
  nickname: string
  role: string
}

interface SetList {
  id: string
  date: string
  title: string
  songs: Song[]
  team_members: TeamMember[]
  notes?: string
}

const ROLES = [
  'Worship Leader', 'Drums', 'Electric Guitar', 'Bass Guitar', 'Acoustic Guitar', 
  'Piano', 'Synthesizer', 'Vocal (Main)', 'Vocal (Sub)'
]

const KEYS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']

export default function WorshipPage() {
  const { isDarkMode } = useTheme()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [sets, setSets] = useState<SetList[]>([])
  const [teamOptions, setTeamOptions] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedSet, setSelectedSet] = useState<SetList | null>(null)

  // New Set Form States
  const [newDate, setNewDate] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [newSongs, setNewSongs] = useState<Song[]>([])
  const [newTeam, setNewTeam] = useState<TeamMember[]>([])
  
  // Song Input States
  const [songLink, setSongLink] = useState('')
  const [songTitle, setSongTitle] = useState('')
  const [songArtist, setSongArtist] = useState('')
  const [songKey, setSongKey] = useState('C')

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/app/profile')
        return
      }

      // Fetch Profile
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      if (profile) {
        setCurrentUser({ ...session.user, ...profile })
        if (profile.role !== 'leader' && profile.role !== 'worship_team') {
          router.push('/app')
          return
        }
      }

      // Fetch Sets
      const { data: setsData } = await supabase.from('worship_sets').select('*').order('date', { ascending: false })
      if (setsData) setSets(setsData)

      // Fetch Team Options (Leader & Worship Team only)
      const { data: members } = await supabase.from('profiles').select('id, nickname').in('role', ['leader', 'worship_team'])
      if (members) setTeamOptions(members)

      setIsLoaded(true)
    }
    init()
  }, [])

  const addSong = () => {
    if (!songTitle) return
    setNewSongs([...newSongs, { title: songTitle, artist: songArtist, key: songKey, link: songLink }])
    setSongTitle('')
    setSongArtist('')
    setSongLink('')
  }

  const removeSong = (index: number) => {
    setNewSongs(newSongs.filter((_, i) => i !== index))
  }

  const findSheet = (title: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(title + " 악보 sheet music")}&tbm=isch`, '_blank')
  }

  const addTeamMember = (userId: string, nickname: string) => {
    if (newTeam.some(m => m.userId === userId)) return
    setNewTeam([...newTeam, { userId, nickname, role: 'Vocal (Sub)' }])
  }

  const updateMemberRole = (userId: string, role: string) => {
    setNewTeam(newTeam.map(m => m.userId === userId ? { ...m, role } : m))
  }

  const createSet = async () => {
    if (!newDate || !newTitle) {
      alert("Please enter date and title.")
      return
    }

    const { data, error } = await supabase.from('worship_sets').insert({
      date: newDate,
      title: newTitle,
      notes: newNotes,
      songs: newSongs,
      team_members: newTeam
    }).select()

    if (error) {
      alert(error.message)
    } else {
      if (data) setSets([data[0], ...sets])
      setIsAddModalOpen(false)
      // Reset
      setNewSongs([])
      setNewTeam([])
      setNewTitle('')
      setNewNotes('')
    }
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
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Team Assignments</h3>
              <div className="grid grid-cols-1 gap-3">
                {selectedSet.team_members?.map((member, i) => (
                  <div key={i} className={`p-5 rounded-3xl border ${cardBg} flex items-center justify-between`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${accentBg} flex items-center justify-center font-black text-xs`}>
                        {member.nickname[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black tracking-tight">{member.nickname}</p>
                        <p className={`text-[9px] font-bold uppercase tracking-widest ${accentColor}`}>{member.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Songs List</h3>
              <div className="space-y-4">
                {selectedSet.songs.map((song, i) => (
                  <div key={i} className={`p-6 rounded-[32px] border ${cardBg} flex flex-col gap-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${isDarkMode ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-slate-300'}`}>
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="text-lg font-black tracking-tight">{song.title}</h4>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{song.artist} • <span className={accentColor}>{song.key} Key</span></p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => findSheet(song.title)} className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-800' : 'bg-white'} shadow-md`} title="Search Sheet">
                          <span className="material-icons text-lg">description</span>
                        </button>
                        {song.link && (
                          <a href={song.link} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full flex items-center justify-center ${accentBg} shadow-md`}>
                            <span className="material-icons text-xl">play_arrow</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Set Modal */}
      {isAddModalOpen && (
        <div className={`fixed inset-0 z-[110] flex flex-col animate-in fade-in zoom-in duration-300 ${bgColor} no-scrollbar overflow-y-auto`}>
          <header className="px-6 pt-16 pb-6 flex items-center justify-between border-b border-zinc-500/10 sticky top-0 bg-inherit z-10">
            <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-500/10"><span className="material-icons text-xl">close</span></button>
            <h2 className="text-sm font-black uppercase tracking-widest opacity-40">Create Setlist</h2>
            <button onClick={createSet} className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest ${accentBg} shadow-lg active:scale-90 transition-all`}>Save All</button>
          </header>
          
          <div className="flex-1 px-8 py-10 space-y-12">
            {/* Step 1: Basic Info */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="date" value={newDate} onChange={(e)=>setNewDate(e.target.value)} className={`w-full p-5 rounded-2xl outline-none font-bold ${cardBg} border`} />
                <input type="text" placeholder="Title (e.g. Sunday Morning)" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} className={`w-full p-5 rounded-2xl outline-none font-bold ${cardBg} border`} />
              </div>
            </div>

            {/* Step 2: Songs */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Songs Management</h3>
              
              {/* Added Songs List */}
              <div className="space-y-3">
                {newSongs.map((song, i) => (
                  <div key={i} className={`p-4 rounded-2xl border ${cardBg} flex items-center justify-between`}>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black opacity-20">{i+1}</span>
                      <div>
                        <p className="text-sm font-black">{song.title}</p>
                        <p className="text-[9px] font-bold opacity-50 uppercase">{song.key} Key • {song.artist}</p>
                      </div>
                    </div>
                    <button onClick={() => removeSong(i)} className="text-red-500/50 hover:text-red-500"><span className="material-icons text-lg">delete</span></button>
                  </div>
                ))}
              </div>

              {/* Add Song Form */}
              <div className={`p-6 rounded-[32px] border ${isDarkMode ? 'bg-zinc-900/30' : 'bg-slate-100/50'} space-y-4`}>
                <input type="text" placeholder="Song Title" value={songTitle} onChange={(e)=>setSongTitle(e.target.value)} className={`w-full p-4 rounded-xl outline-none font-bold ${cardBg} border text-sm`} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Artist" value={songArtist} onChange={(e)=>setSongArtist(e.target.value)} className={`w-full p-4 rounded-xl outline-none font-bold ${cardBg} border text-xs`} />
                  <select value={songKey} onChange={(e)=>setSongKey(e.target.value)} className={`w-full p-4 rounded-xl outline-none font-bold ${cardBg} border text-xs appearance-none`}>
                    {KEYS.map(k => <option key={k} value={k}>{k} Key</option>)}
                  </select>
                </div>
                <input type="text" placeholder="YouTube/Spotify Link" value={songLink} onChange={(e)=>setSongLink(e.target.value)} className={`w-full p-4 rounded-xl outline-none font-bold ${cardBg} border text-xs`} />
                <button onClick={addSong} className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest bg-zinc-500/10 hover:bg-zinc-500/20 transition-all`}>Add to Set</button>
              </div>
            </div>

            {/* Step 3: Team */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Team Building</h3>
              
              {/* Selected Team */}
              <div className="grid grid-cols-1 gap-3">
                {newTeam.map((m, i) => (
                  <div key={i} className={`p-4 rounded-2xl border ${cardBg} flex items-center justify-between`}>
                    <p className="text-sm font-black">{m.nickname}</p>
                    <select 
                      value={m.role} 
                      onChange={(e) => updateMemberRole(m.userId, e.target.value)}
                      className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none"
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* Member Picker */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {teamOptions.map(opt => (
                  <button 
                    key={opt.id} 
                    onClick={() => addTeamMember(opt.id, opt.nickname)}
                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${newTeam.some(m => m.userId === opt.id) ? accentBg : 'bg-zinc-500/10'}`}
                  >
                    {opt.nickname}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pb-20">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-30 pl-2">General Notes</p>
              <textarea placeholder="Instructions for the whole team..." value={newNotes} onChange={(e)=>setNewNotes(e.target.value)} className={`w-full h-32 p-6 rounded-[32px] outline-none font-bold ${cardBg} border resize-none`} />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{` .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .font-pretendard { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; } `}</style>
    </div>
  )
}
