"use client"

import React, { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Song {
  id?: string
  title: string
  artist: string
  key: string
  link: string
  sheetUrl?: string
  thumbnail?: string
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
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming')

  // New Set Form States
  const [newDate, setNewDate] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [newSongs, setNewSongs] = useState<Song[]>([])
  const [newTeam, setNewTeam] = useState<TeamMember[]>([])
  const [detectedSongs, setDetectedSongs] = useState<Song[]>([])
  
  // Song Input States
  const [songLink, setSongLink] = useState('')
  const [songTitle, setSongTitle] = useState('')
  const [songArtist, setSongArtist] = useState('')
  const [songKey, setSongKey] = useState('C')
  const [songThumbnail, setSongThumbnail] = useState('')
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isPlaylist, setIsPlaylist] = useState(false)

  useEffect(() => {
    // 1. Instant Load from LocalStorage
    const savedUser = localStorage.getItem('pf_current_user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setCurrentUser(user)
      // If not authorized, redirect early
      if (user.role !== 'leader' && user.role !== 'worship_team') {
        router.push('/app')
      }
    }

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (!savedUser) router.push('/app/profile')
        return
      }

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      const user = profile ? { ...session.user, ...profile } : session.user
      setCurrentUser(user)
      localStorage.setItem('pf_current_user', JSON.stringify(user))

      if (user.role !== 'leader' && user.role !== 'worship_team') {
        router.push('/app')
        return
      }

      // Initial Fetch
      fetchSets()

      // 1. Supabase Realtime Subscription (Live Sync)
      const channel = supabase
        .channel('worship_sets_changes')
        .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'worship_sets' }, (payload: any) => {
          console.log('Realtime update received:', payload)
          fetchSets() // Refresh all to keep order correct
        })
        .subscribe()

      // Fetch Team Options
      const { data: members } = await supabase.from('profiles').select('id, nickname').in('role', ['leader', 'worship_team'])
      if (members) setTeamOptions(members)

      setIsLoaded(true)

      return () => {
        supabase.removeChannel(channel)
      }
    }
    init()
  }, [])

  const fetchSets = async () => {
    const { data: setsData } = await supabase.from('worship_sets').select('*').order('date', { ascending: false })
    if (setsData) setSets(setsData)
  }

  const handleLinkChange = async (url: string) => {
    setSongLink(url)
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('music.youtube.com') || url.includes('spotify.com')) {
      setIsPreviewing(true)
      const playlist = url.includes('playlist') || url.includes('list=')
      setIsPlaylist(playlist)
      
      try {
        const response = await fetch('/api/fetch-metadata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        })
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.type === 'playlist' && data.tracks && data.tracks.length > 0) {
            // Playlist: auto-add ALL tracks directly as individual cards
            const tracks: Song[] = data.tracks.map((t: any) => ({
              id: Math.random().toString(36).substring(7),
              title: t.title || '',
              artist: t.artist || '',
              key: 'C',
              link: url,
              thumbnail: t.thumbnail || ''
            }))
            setNewSongs(prev => [...prev, ...tracks])
            // Clear input for next use
            setSongLink('')
            setSongTitle('')
            setSongArtist('')
            setSongThumbnail('')
            setIsPlaylist(false)
          } else if (data.type === 'track' || (data.type === 'playlist' && (!data.tracks || data.tracks.length === 0))) {
            // Single track or failed playlist extraction → show single track preview
            setIsPlaylist(false)
            setSongTitle(data.title || data.playlistTitle || '')
            setSongArtist(data.artist || '')
            setSongThumbnail(data.thumbnail || '')
          }
        } else {
          console.error('Metadata error')
          setSongTitle('')
          setSongArtist('')
          setSongThumbnail('')
        }
      } catch (err) {
        console.error('Network error fetching metadata', err)
      } finally {
        setIsPreviewing(false)
      }
    }
  }

  const addSong = (specificSong?: Song) => {
    const target = specificSong ? { ...specificSong, id: specificSong.id || Math.random().toString(36).substring(7) } : { id: Math.random().toString(36).substring(7), title: songTitle, artist: songArtist, key: songKey, link: songLink, thumbnail: songThumbnail }
    if (!target.title) return
    setNewSongs([...newSongs, target])
    if (!specificSong) {
      setSongTitle('')
      setSongArtist('')
      setSongLink('')
      setSongKey('C')
      setSongThumbnail('')
    }
    setIsPreviewing(false)
  }

  const addAllDetected = () => {
    setNewSongs([...newSongs, ...detectedSongs])
    setDetectedSongs([])
    setSongLink('')
  }

  const removeSong = (index: number) => {
    setNewSongs(newSongs.filter((_, i) => i !== index))
  }

  const updateSong = (index: number, field: keyof Song, value: string) => {
    setNewSongs(newSongs.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const findSheet = (title: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(title + " 악보 sheet music")}&tbm=isch`, '_blank')
  }

  const [isUploadingSheet, setIsUploadingSheet] = useState<number | null>(null)
  
  const uploadSheet = async (index: number, file: File) => {
    if (!file) return
    setIsUploadingSheet(index)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `sheets/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      // Using 'gallery' bucket as it's the standard public bucket in this app
      const { data, error } = await supabase.storage.from('gallery').upload(fileName, file)
      
      if (error) throw error
      
      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName)
      updateSong(index, 'sheetUrl', publicUrl)
    } catch (error: any) {
      console.error("Upload failed", error)
      alert("Sheet upload failed: " + error.message)
    } finally {
      setIsUploadingSheet(null)
    }
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

  const themeColor = activeTab === 'upcoming' ? '#9a78b4' : '#fffbbd'
  const themeText = activeTab === 'upcoming' ? 'text-white' : 'text-zinc-900'
  const themeBg = activeTab === 'upcoming' ? 'bg-[#9a78b4]' : 'bg-[#fffbbd]'

  const getStatus = (date: string) => {
    const today = new Date().toISOString().split('T')[0]
    if (date === today) return { label: 'TODAY', color: `${themeBg} ${themeText}` }
    if (date > today) return { label: 'UPCOMING', color: `${themeBg} ${themeText}` }
    return { label: 'COMPLETED', color: 'bg-zinc-500/20 text-zinc-500' }
  }

  const bgColor = isDarkMode ? 'bg-[#050505]' : 'bg-[#F8FAFC]'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const accentColor = `text-[${themeColor}]`
  const accentBg = `${themeBg} ${themeText}`
  const cardBg = isDarkMode ? 'bg-zinc-900/40 border-zinc-500/10' : 'bg-white border-slate-200'

  // Safety Render: Only show loading if we literally have zero user info
  if (!currentUser && !isLoaded) {
    return (
      <div className={`min-h-screen ${bgColor} flex flex-col items-center justify-center p-8 text-center`}>
        <div className="w-12 h-12 border-4 border-[#9a78b4] border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Verifying Authorization...</p>
      </div>
    )
  }

  const filteredSets = sets.filter(set => {
    const today = new Date().toISOString().split('T')[0]
    return activeTab === 'upcoming' ? set.date >= today : set.date < today
  })
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEndNew = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setNewSongs((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} pb-40 transition-colors duration-500 font-pretendard`}>
      <header className="px-6 pt-20 pb-4 flex items-center justify-between sticky top-0 z-40 bg-inherit/80 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Worship</h1>
          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em]">Set List & Practice</p>
        </div>
        {(currentUser.role === 'leader' || currentUser.role === 'worship_team') && (
          <button onClick={() => setIsAddModalOpen(true)} className={`w-10 h-10 rounded-full flex items-center justify-center ${accentBg} shadow-lg active:scale-90 transition-all duration-700`}>
            <span className="material-icons">add</span>
          </button>
        )}
      </header>

      {/* Tab Selector */}
      <div className="px-6 mb-8 mt-2">
        <div className={`p-1.5 rounded-full ${isDarkMode ? 'bg-zinc-900/60' : 'bg-slate-100'} flex gap-1`}>
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'upcoming' ? 'bg-[#9a78b4] text-white shadow-md' : 'opacity-40'}`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === 'history' ? 'bg-[#fffbbd] text-zinc-900 shadow-md' : 'opacity-40'}`}
          >
            History
          </button>
        </div>
      </div>

      <section className="px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {filteredSets.length > 0 ? filteredSets.map(set => {
          const status = getStatus(set.date)
          return (
            <div 
              key={set.id} 
              onClick={() => setSelectedSet(set)} 
              className={`rounded-[36px] overflow-hidden border ${cardBg} shadow-sm active:scale-[0.98] transition-all cursor-pointer flex flex-col`}
            >
              {/* Image-inspired Status Bar */}
              <div className={`h-8 flex items-center justify-center ${status.color}`}>
                <p className="text-[9px] font-black tracking-[0.4em] uppercase">{status.label}</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight leading-tight">{set.title}</h3>
                  <p className="text-xs font-bold opacity-40 line-clamp-2 leading-relaxed">
                    {set.songs.length > 0 ? set.songs.map(s => s.title).join(', ') : 'No songs added yet.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {/* Team Avatars Stack */}
                  <div className="flex -space-x-3">
                    {set.team_members?.slice(0, 4).map((m, i) => (
                      <div key={i} className={`w-10 h-10 rounded-full border-2 ${isDarkMode ? 'border-zinc-900' : 'border-white'} ${accentBg} flex items-center justify-center text-[10px] font-black`}>
                        {m.nickname[0]}
                      </div>
                    ))}
                    {(set.team_members?.length || 0) > 4 && (
                      <div className={`w-10 h-10 rounded-full border-2 ${isDarkMode ? 'border-zinc-900' : 'border-white'} bg-zinc-800 text-zinc-500 flex items-center justify-center text-[10px] font-black`}>
                        +{set.team_members!.length - 4}
                      </div>
                    )}
                  </div>
                  
                  {/* Status Tag */}
                  <div className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-zinc-800' : 'bg-slate-100'} text-[9px] font-black uppercase tracking-widest opacity-60`}>
                    In Progress
                  </div>
                </div>

                {/* Bottom Metadata Bar */}
                <div className="pt-6 border-t border-zinc-500/5 flex items-center justify-between">
                  <div className="flex items-center gap-6 opacity-30">
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-sm">music_note</span>
                      <span className="text-[10px] font-black">{set.songs.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-sm">link</span>
                      <span className="text-[10px] font-black">{set.songs.filter(s => s.link).length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-sm">description</span>
                      <span className="text-[10px] font-black">{set.notes ? 1 : 0}</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-30">
                    {new Date(set.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          )
        }) : (
          <div className="py-20 flex flex-col items-center justify-center opacity-20 space-y-4">
            <span className="material-icons text-6xl">auto_awesome</span>
            <p className="text-[10px] font-black uppercase tracking-widest">No sets found in {activeTab}</p>
          </div>
        )}
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
              <div className="grid grid-cols-2 gap-4">
                {selectedSet.songs.map((song, i) => {
                  const cardColors = [
                    'bg-[#b8a99a]', 'bg-[#a3aa7e]', 'bg-[#c2a882]',
                    'bg-[#8a9e8a]', 'bg-[#9a9a9a]', 'bg-[#c9a08a]',
                    'bg-[#8a8e9e]', 'bg-[#9a8a7a]', 'bg-[#a8967a]'
                  ]
                  const cardColor = cardColors[i % cardColors.length]
                  return (
                    <div key={i} className={`${cardColor} rounded-[28px] p-4 flex flex-col gap-3 shadow-lg transition-all active:scale-[0.97]`}>
                      {/* Thumbnail */}
                      <div className="w-full aspect-square rounded-[20px] overflow-hidden bg-black/10 flex items-center justify-center">
                        {song.thumbnail ? (
                          <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-icons text-5xl text-white/30">music_note</span>
                        )}
                      </div>
                      {/* Info */}
                      <div className="px-1 space-y-0.5 min-h-[40px]">
                        <p className="text-sm font-black tracking-tight text-white leading-tight line-clamp-1">{song.title}</p>
                        <p className="text-[10px] font-bold text-white/60 line-clamp-1">{song.artist}</p>
                      </div>
                      {/* Action Bar: Key / Sheet / Link */}
                      <div className="flex items-center justify-between px-1">
                        <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[9px] font-black tracking-wider">{song.key}</span>
                        <div className="flex gap-1.5">
                          <button onClick={(e) => { e.stopPropagation(); findSheet(song.title) }} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="material-icons text-white text-sm">description</span>
                          </button>
                          {song.link && (
                            <a href={song.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                              <span className="material-icons text-white text-sm">play_arrow</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
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
              
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndNew}>
                <SortableContext items={newSongs.map(s => s.id as string)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-2 gap-4">
                    {newSongs.map((song, i) => (
                      <SortableSongCard 
                        key={song.id} 
                        song={song} 
                        index={i} 
                        updateSong={updateSong} 
                        removeSong={removeSong} 
                        findSheet={findSheet} 
                        uploadSheet={uploadSheet}
                        isUploading={isUploadingSheet === i}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add Song Form - The "Magic" Input */}
              <div className={`p-8 rounded-[40px] border ${isDarkMode ? 'bg-zinc-900/30' : 'bg-slate-100/50'} space-y-6 relative overflow-hidden`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Add Song via Link</p>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse delay-75"></div>
                    </div>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Paste YouTube or Spotify Link here..." 
                      value={songLink} 
                      onChange={(e)=>handleLinkChange(e.target.value)} 
                      className={`w-full p-6 rounded-[28px] outline-none font-bold ${cardBg} border-2 ${songLink && !isPreviewing ? 'border-brand-yellow/30' : 'border-transparent'} text-sm transition-all pr-12`} 
                    />
                    {isPreviewing && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        <span className="material-icons animate-spin text-brand-yellow">sync</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Single Track Preview Card */}
                {(songTitle || isPreviewing) && (
                  <div className={`p-6 rounded-[32px] ${isDarkMode ? 'bg-zinc-800/80' : 'bg-white'} border border-zinc-500/10 animate-in fade-in zoom-in-95 duration-500`}>
                    {isPreviewing ? (
                      <div className="flex flex-col items-center gap-6 py-6">
                        <div className={`w-16 h-16 rounded-full border-4 border-[${themeColor}]/20 border-t-[${themeColor}] animate-spin`}></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
                          {isPlaylist ? "Extracting Playlist Tracks..." : "Detecting Song Metadata..."}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Music Card Preview */}
                        <div className="bg-[#b8a99a] rounded-[28px] p-5 mx-auto max-w-[220px] space-y-3">
                          <div className="w-full aspect-square rounded-[20px] overflow-hidden bg-black/10 flex items-center justify-center">
                            {songThumbnail ? (
                              <img src={songThumbnail} alt={songTitle} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-icons text-5xl text-white/30">music_note</span>
                            )}
                          </div>
                          <div className="px-1 space-y-1">
                            <input 
                              type="text" 
                              value={songTitle} 
                              onChange={(e)=>setSongTitle(e.target.value)}
                              className="bg-transparent font-black text-sm text-white outline-none w-full placeholder-white/30"
                              placeholder="Song Title"
                            />
                            <input 
                              type="text" 
                              value={songArtist} 
                              onChange={(e)=>setSongArtist(e.target.value)}
                              className="bg-transparent text-[10px] font-bold text-white/60 outline-none w-full placeholder-white/20"
                              placeholder="Artist"
                            />
                          </div>
                          <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest inline-block">Detected</div>
                        </div>

                        <div className="space-y-3">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 px-1">Select Performance Key</p>
                          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                            {KEYS.map(k => (
                              <button 
                                key={k} 
                                onClick={() => setSongKey(k)}
                                className={`min-w-[44px] h-10 rounded-xl font-black text-[10px] transition-all ${songKey === k ? accentBg : cardBg + ' border opacity-40'}`}
                              >
                                {k}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button 
                          onClick={() => addSong()}
                          className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] ${accentBg} shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2`}
                        >
                          <span className="material-icons text-sm">add_task</span>
                          Confirm & Add to Setlist
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Team */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Team Assignments</h3>
              
              {/* Selected Team with Tags */}
              <div className="grid grid-cols-1 gap-4">
                {newTeam.map((m, i) => (
                  <div key={i} className={`p-6 rounded-[32px] border ${cardBg} space-y-4`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black tracking-tight">{m.nickname}</p>
                      <button onClick={() => setNewTeam(newTeam.filter(t => t.userId !== m.userId))} className="text-red-500/20 hover:text-red-500 transition-colors">
                        <span className="material-icons text-sm">remove_circle</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ROLES.map(role => {
                        const isAssigned = m.role.split(', ').includes(role)
                        return (
                          <button 
                            key={role}
                            onClick={() => {
                              const currentRoles = m.role ? m.role.split(', ').filter(r => r) : []
                              const nextRoles = currentRoles.includes(role) 
                                ? currentRoles.filter(r => r !== role)
                                : [...currentRoles, role]
                              updateMemberRole(m.userId, nextRoles.join(', '))
                            }}
                            className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isAssigned ? accentBg : 'bg-zinc-500/10 opacity-40'}`}
                          >
                            {role}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Member Picker */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Add Members</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {teamOptions.map(opt => (
                    <button 
                      key={opt.id} 
                      onClick={() => addTeamMember(opt.id, opt.nickname)}
                      className={`px-6 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${newTeam.some(m => m.userId === opt.id) ? accentBg : 'bg-zinc-500/10 border border-zinc-500/5'}`}
                    >
                      {opt.nickname}
                    </button>
                  ))}
                </div>
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

interface SortableSongCardProps {
  song: Song
  index: number
  updateSong: (index: number, field: keyof Song, value: string) => void
  removeSong: (index: number) => void
  findSheet: (title: string) => void
  uploadSheet: (index: number, file: File) => void
  isUploading?: boolean
}

function SortableSongCard({ song, index, updateSong, removeSong, findSheet, uploadSheet, isUploading }: SortableSongCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: song.id as string })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative' as any,
    scale: isDragging ? 1.05 : 1,
  }

  const cardColors = [
    'bg-[#b8a99a]', 'bg-[#a3aa7e]', 'bg-[#c2a882]',
    'bg-[#8a9e8a]', 'bg-[#9a9a9a]', 'bg-[#c9a08a]',
    'bg-[#8a8e9e]', 'bg-[#9a8a7a]', 'bg-[#a8967a]'
  ]
  const cc = cardColors[index % cardColors.length]

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className={`${cc} rounded-[28px] p-4 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-300 shadow-lg group select-none`}
    >
      {/* Delete Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); removeSong(index); }} 
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 backdrop-blur-sm"
      >
        <span className="material-icons text-sm">close</span>
      </button>

      {/* Thumbnail */}
      <div className="w-full aspect-square rounded-[20px] overflow-hidden bg-black/10 flex items-center justify-center pointer-events-none">
        {song.thumbnail ? (
          <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
        ) : (
          <span className="material-icons text-5xl text-white/30">music_note</span>
        )}
      </div>

      {/* Editable Title & Artist */}
      <div className="px-1 space-y-1">
        <input 
          type="text"
          value={song.title}
          onChange={(e) => updateSong(index, 'title', e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          className="bg-transparent font-black text-sm text-white outline-none w-full placeholder-white/30 leading-tight"
          placeholder="Song Title"
        />
        <input 
          type="text"
          value={song.artist}
          onChange={(e) => updateSong(index, 'artist', e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          className="bg-transparent text-[10px] font-bold text-white/60 outline-none w-full placeholder-white/20"
          placeholder="Artist"
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between px-1 pt-1">
        <select
          value={song.key}
          onChange={(e) => updateSong(index, 'key', e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          className="bg-white/20 text-white text-[9px] font-black rounded-full px-3 py-1.5 outline-none cursor-pointer appearance-none text-center"
        >
          {KEYS.map(k => <option key={k} value={k} className="text-black">{k}</option>)}
        </select>
        <div className="flex gap-1.5">
          <button 
            onClick={(e) => { e.stopPropagation(); findSheet(song.title); }} 
            onPointerDown={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors" 
            title="Search Web for Sheet"
          >
            <span className="material-icons text-sm">search</span>
          </button>
          
          <input 
            type="file" 
            accept="image/*,application/pdf" 
            className="hidden" 
            id={`sheet-upload-${song.id}`}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadSheet(index, file);
              e.target.value = ''; // Reset input
            }}
          />
          <label 
            htmlFor={`sheet-upload-${song.id}`}
            onPointerDown={(e) => e.stopPropagation()}
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${song.sheetUrl ? 'bg-green-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'} ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            title={song.sheetUrl ? "Sheet Uploaded (Click to replace)" : "Upload Sheet File"}
          >
            {isUploading ? (
              <span className="material-icons text-sm animate-spin">sync</span>
            ) : (
              <span className="material-icons text-sm">{song.sheetUrl ? "check" : "upload_file"}</span>
            )}
          </label>

          {song.sheetUrl && (
            <a 
              href={song.sheetUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center hover:bg-green-500/30 transition-colors" 
              title="View Sheet"
            >
              <span className="material-icons text-sm">visibility</span>
            </a>
          )}

          {song.link && (
            <a 
              href={song.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center" 
              title="Open Original"
            >
              <span className="material-icons text-white text-sm">play_arrow</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

