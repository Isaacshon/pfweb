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
  songForm?: string[]
  solos?: string[]
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

const SONG_SECTIONS = [
  'Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Post-Chorus', 
  'Bridge', 'Interlude', 'Instrumental', 'Tag', 'Outro', 'Ad-lib', 'Ending'
]

export default function WorshipPage() {
  const { isDarkMode } = useTheme()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [sets, setSets] = useState<SetList[]>([])
  const [teamOptions, setTeamOptions] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFetchingSets, setIsFetchingSets] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingSetId, setEditingSetId] = useState<string | null>(null)
  const [selectedSet, setSelectedSet] = useState<SetList | null>(null)
  const [detailViewMode, setDetailViewMode] = useState<'cards' | 'practice'>('cards')
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('pf_worship_tab') as 'upcoming' | 'history') || 'upcoming'
    }
    return 'upcoming'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pf_worship_tab', activeTab)
    }
  }, [activeTab])

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
  const [isSaving, setIsSaving] = useState(false)
  const [isFetchingTeam, setIsFetchingTeam] = useState(false)
  const [memberSearch, setMemberSearch] = useState('')
  const [notification, setNotification] = useState<string | null>(null)

  const showNotify = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 4000)
  }

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

  useEffect(() => {
    const handlePopState = () => {
      if (isAddModalOpen) {
        setIsAddModalOpen(false)
        setEditingSetId(null)
      }
      if (selectedSet) {
        setSelectedSet(null)
      }
    }

    if (isAddModalOpen || selectedSet) {
      window.history.pushState({ modal: true }, '')
      window.addEventListener('popstate', handlePopState)
      return () => {
        window.removeEventListener('popstate', handlePopState)
      }
    }
  }, [isAddModalOpen, selectedSet])

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

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
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

      // Initial Fetch
      fetchSets()
      fetchTeamOptions()

      setIsLoaded(true)

      return () => {
        supabase.removeChannel(channel)
      }
    }
    init()
  }, [])

  const fetchSets = async () => {
    setIsFetchingSets(true)
    try {
      const { data: setsData, error } = await supabase.from('worship_sets').select('*').order('date', { ascending: false })
      if (error) throw error
      if (setsData) setSets(setsData)
    } catch (err) {
      console.error("Fetch sets error:", err)
    } finally {
      setIsFetchingSets(false)
    }
  }

  const fetchTeamOptions = async () => {
    setIsFetchingTeam(true)
    try {
      // Fetch all profiles and filter on client for better reliability
      const { data: members, error } = await supabase
        .from('profiles')
        .select('id, nickname, username, role')
      
      if (error) {
        showNotify("Failed to fetch members: " + error.message)
        throw error
      }
      
      if (members) {
        // Only include people with leadership or team roles
        const validMembers = members.filter(m => 
          ['leader', 'worship_team', 'user'].includes(m.role)
        )
        setTeamOptions(validMembers)
      }
    } catch (err: any) {
      console.error("Fetch team options error:", err)
    } finally {
      setIsFetchingTeam(false)
    }
  }

  // Fetch team whenever modal opens to ensure fresh data
  useEffect(() => {
    if (isAddModalOpen) {
      fetchTeamOptions()
    }
  }, [isAddModalOpen])

  const handleLinkChange = async (rawUrl: string) => {
    setSongLink(rawUrl)
    
    // Extract actual URL in case of "dirty" paste (extra text, multiple lines)
    const urlMatch = rawUrl.match(/https?:\/\/[^\s]+/)
    const url = urlMatch ? urlMatch[0] : ''
    
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

  const openEditModal = (set: SetList) => {
    setNewDate(set.date)
    setNewTitle(set.title)
    setNewNotes(set.notes || '')
    setNewSongs(set.songs)
    setNewTeam(set.team_members)
    setEditingSetId(set.id)
    setIsAddModalOpen(true)
    setSelectedSet(null)
  }

  const saveSet = async () => {
    if (!newDate || !newTitle) {
      showNotify("Please enter date and title.")
      return
    }
    if (isSaving) return
    setIsSaving(true)

    const payload = {
      date: newDate,
      title: newTitle,
      notes: newNotes,
      songs: newSongs,
      team_members: newTeam
    }

    const wasEditing = editingSetId

    try {
      if (wasEditing) {
        const { error } = await supabase
          .from('worship_sets')
          .update(payload)
          .eq('id', wasEditing)
        if (error) {
          showNotify('Save failed: ' + error.message)
          setIsSaving(false)
          return
        }
      } else {
        const { data, error } = await supabase
          .from('worship_sets')
          .insert(payload)
          .select()
        if (error) {
          showNotify('Save failed: ' + error.message)
          setIsSaving(false)
          return
        }
      }
      
      // Success case
      await fetchSets()
      setIsAddModalOpen(false)
      resetForm()
      showNotify(wasEditing ? "Set list updated successfully." : "Set list created successfully.")
    } catch (err: any) {
      showNotify('Save error: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const deleteSet = async () => {
    if (!editingSetId) return
    if (!confirm("Are you sure you want to delete this set list? This action cannot be undone.")) return

    try {
      const { error } = await supabase
        .from('worship_sets')
        .delete()
        .eq('id', editingSetId)

      if (error) {
        showNotify('Delete failed: ' + error.message)
      } else {
        setSets(prev => prev.filter(s => s.id !== editingSetId))
        setIsAddModalOpen(false)
        resetForm()
        showNotify("Set list deleted successfully.")
      }
    } catch (err: any) {
      showNotify('Delete error: ' + err.message)
    }
  }

  const resetForm = () => {
    setNewSongs([])
    setNewTeam([])
    setNewTitle('')
    setNewNotes('')
    setNewDate('')
    setEditingSetId(null)
  }

  const themeColor = activeTab === 'upcoming' ? '#9a78b4' : '#fffbbd'
  const themeText = activeTab === 'upcoming' ? 'text-white' : 'text-zinc-900'
  const themeBg = activeTab === 'upcoming' ? 'bg-[#9a78b4]' : 'bg-[#fffbbd]'

  const getLocalToday = () => {
    const d = new Date()
    const offset = d.getTimezoneOffset() * 60000
    return new Date(d.getTime() - offset).toISOString().split('T')[0]
  }

  const getStatus = (date: string) => {
    const today = getLocalToday()
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
    const today = getLocalToday()
    return activeTab === 'upcoming' ? set.date >= today : set.date < today
  })

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
    <div className={`min-h-screen ${bgColor} ${textColor} pb-40 transition-colors duration-500 font-pretendard relative`}>
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 duration-500 w-11/12 max-w-sm">
          <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'} border px-6 py-4 rounded-3xl shadow-2xl flex items-start gap-3`}>
            <span className={`material-icons text-xl ${accentColor} mt-0.5`}>info</span>
            <p className="text-sm font-bold tracking-tight leading-relaxed">{notification}</p>
          </div>
        </div>
      )}
      <header className="px-6 pt-20 pb-4 flex items-center justify-between sticky top-0 z-40 bg-inherit/80 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Worship</h1>
          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em]">Set List & Practice</p>
        </div>
        {(currentUser.role === 'leader' || currentUser.role === 'worship_team') && (
          <button onClick={() => { resetForm(); setIsAddModalOpen(true); }} className={`w-10 h-10 rounded-full flex items-center justify-center ${accentBg} shadow-lg active:scale-90 transition-all duration-700`}>
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
        }) : isFetchingSets ? (
          <div className={`rounded-[36px] overflow-hidden border ${cardBg} shadow-sm p-8 space-y-6 animate-pulse`}>
            <div className="h-8 w-1/3 bg-zinc-500/20 rounded-full"></div>
            <div className="space-y-3">
              <div className="h-6 w-3/4 bg-zinc-500/20 rounded-lg"></div>
              <div className="h-4 w-1/2 bg-zinc-500/20 rounded-lg"></div>
            </div>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center opacity-20 space-y-4">
            <span className="material-icons text-6xl">auto_awesome</span>
            <p className="text-[10px] font-black uppercase tracking-widest">No sets found in {activeTab}</p>
          </div>
        )}
      </section>

      {/* Set Details Modal */}
      {selectedSet && (() => {
        const updatePracticeSong = (songIndex: number, field: 'songForm' | 'solos', value: string[]) => {
          const updatedSongs = selectedSet.songs.map((s, i) => i === songIndex ? { ...s, [field]: value } : s)
          const updatedSet = { ...selectedSet, songs: updatedSongs }
          setSelectedSet(updatedSet)
          setSets(prev => prev.map(s => s.id === selectedSet.id ? updatedSet : s))
          // Background save
          supabase.from('worship_sets').update({ songs: updatedSongs }).eq('id', selectedSet.id).then(({ error }) => {
            if (error) console.error('Practice save error:', error)
          })
        }

        return (
        <div className={`fixed inset-0 z-[100] flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500 ${bgColor}`}>
          <header className="px-6 pt-16 pb-4 flex items-center justify-between border-b border-zinc-500/10">
            <button onClick={() => { setSelectedSet(null); setDetailViewMode('cards'); }} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-500/10"><span className="material-icons text-xl">close</span></button>
            <h2 className="text-sm font-black uppercase tracking-widest opacity-40">Set Details</h2>
            {currentUser?.role === 'leader' ? (
              <button onClick={() => openEditModal(selectedSet)} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-500/10 text-[#9c7eb7]">
                <span className="material-icons text-xl">edit</span>
              </button>
            ) : (
              <div className="w-10"></div>
            )}
          </header>

          {/* View Mode Toggle */}
          <div className="px-6 py-3 flex gap-2 border-b border-zinc-500/5">
            <button onClick={() => setDetailViewMode('cards')} className={`flex-1 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${detailViewMode === 'cards' ? 'bg-[#9c7eb7] text-white' : 'bg-zinc-500/10 opacity-50'}`}>
              <span className="material-icons text-sm">grid_view</span>
              Song Cards
            </button>
            <button onClick={() => setDetailViewMode('practice')} className={`flex-1 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${detailViewMode === 'practice' ? 'bg-[#9c7eb7] text-white' : 'bg-zinc-500/10 opacity-50'}`}>
              <span className="material-icons text-sm">queue_music</span>
              Practice
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 no-scrollbar">
            {/* Header */}
            <div>
              <p className={`text-xs font-black uppercase tracking-[0.3em] text-[#9c7eb7] mb-3`}>{selectedSet.date}</p>
              <h2 className="text-4xl font-black tracking-tighter leading-tight mb-4">{selectedSet.title}</h2>
              {selectedSet.notes && <p className="text-sm opacity-50 leading-relaxed font-medium">{selectedSet.notes}</p>}
            </div>

            {/* Team */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Team Assignments</h3>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {selectedSet.team_members?.map((member, i) => (
                  <div key={i} className={`px-4 py-2 rounded-full border ${cardBg} flex items-center gap-2 shrink-0`}>
                    <div className={`w-6 h-6 rounded-lg bg-[#9c7eb7] text-white flex items-center justify-center font-black text-[9px]`}>
                      {member.nickname[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black leading-tight">{member.nickname}</span>
                      <span className="text-[7px] font-bold text-[#9c7eb7] uppercase tracking-wider leading-tight">{member.role?.split(', ')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== SONG CARDS VIEW ===== */}
            {detailViewMode === 'cards' && (
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
                      <div key={i} className={`${cardColor} rounded-[28px] p-3 flex flex-col gap-2.5 shadow-lg transition-all active:scale-[0.97]`}>
                        <div className="w-full aspect-square rounded-[20px] overflow-hidden bg-black/10 flex items-center justify-center">
                          {song.thumbnail ? (
                            <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-icons text-5xl text-white/30">music_note</span>
                          )}
                        </div>
                        <div className="px-1 space-y-0.5 min-h-[40px]">
                          <p className="text-sm font-black tracking-tight text-white leading-tight line-clamp-1">{song.title}</p>
                          <p className="text-[10px] font-bold text-white/60 line-clamp-1">{song.artist}</p>
                        </div>
                        <div className="flex flex-col gap-2 px-1 pt-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Key</span>
                            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[9px] font-black tracking-wider min-w-[24px] text-center">{song.key}</span>
                          </div>
                          <div className="flex gap-1 justify-end">
                            <button onClick={(e) => { e.stopPropagation(); findSheet(song.title) }} className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                              <span className="material-icons text-white text-[11px]">description</span>
                            </button>
                            {song.link && (
                              <a href={song.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <span className="material-icons text-white text-[11px]">play_arrow</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ===== PRACTICE VIEW ===== */}
            {detailViewMode === 'practice' && (
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Practice Mode</h3>
                {selectedSet.songs.map((song, songIdx) => (
                  <div key={songIdx} className={`rounded-[32px] border ${cardBg} overflow-hidden`}>
                    {/* Song Header */}
                    <div className="p-5 flex items-center gap-4 border-b border-zinc-500/10">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-zinc-500/10 shrink-0 flex items-center justify-center">
                        {song.thumbnail ? (
                          <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-icons text-xl text-zinc-400">music_note</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black tracking-tight leading-tight truncate">{song.title}</p>
                        <p className="text-[10px] font-bold opacity-40 truncate">{song.artist}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#9c7eb7]/10 text-[#9c7eb7] text-[10px] font-black shrink-0">{song.key}</span>
                    </div>

                    {/* Song Form Section */}
                    <div className="p-5 border-b border-zinc-500/5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-icons text-[14px] text-[#9c7eb7]">queue_music</span>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Song Form</p>
                        {(song.songForm || []).length > 0 && (
                          <button 
                            onClick={() => updatePracticeSong(songIdx, 'songForm', [])}
                            className="ml-auto text-[8px] font-black text-red-500/50 uppercase tracking-widest hover:text-red-500 transition-colors"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      {/* Current form tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3 min-h-[28px]">
                        {(song.songForm || []).map((section, secIdx) => (
                          <div key={secIdx} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#9c7eb7] text-white text-[9px] font-black uppercase tracking-wider animate-in zoom-in-95 duration-200">
                            <span>{section}</span>
                            <button onClick={() => {
                              const updated = [...(song.songForm || [])]
                              updated.splice(secIdx, 1)
                              updatePracticeSong(songIdx, 'songForm', updated)
                            }} className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                              <span className="material-icons text-[8px]">close</span>
                            </button>
                          </div>
                        ))}
                        {(!song.songForm || song.songForm.length === 0) && (
                          <p className="text-[9px] font-bold opacity-20 italic py-1">Tap sections below to build song form</p>
                        )}
                      </div>
                      {/* Section picker */}
                      <div className="flex flex-wrap gap-1">
                        {SONG_SECTIONS.map(section => (
                          <button
                            key={section}
                            onClick={() => {
                              const updated = [...(song.songForm || []), section]
                              updatePracticeSong(songIdx, 'songForm', updated)
                            }}
                            className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-zinc-800 text-zinc-400 hover:bg-[#9c7eb7]/30 hover:text-[#9c7eb7]' : 'bg-zinc-100 text-zinc-500 hover:bg-[#9c7eb7]/10 hover:text-[#9c7eb7]'}`}
                          >
                            + {section}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Solo Section */}
                    <div className="p-5 border-b border-zinc-500/5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-icons text-[14px] text-[#9c7eb7]">mic</span>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Solo</p>
                      </div>
                      {/* Current solos */}
                      <div className="flex flex-wrap gap-1.5 mb-3 min-h-[28px]">
                        {(song.solos || []).map((name, soloIdx) => (
                          <div key={soloIdx} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/80 text-white text-[9px] font-black uppercase tracking-wider animate-in zoom-in-95 duration-200">
                            <span>{name}</span>
                            <button onClick={() => {
                              const updated = [...(song.solos || [])]
                              updated.splice(soloIdx, 1)
                              updatePracticeSong(songIdx, 'solos', updated)
                            }} className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                              <span className="material-icons text-[8px]">close</span>
                            </button>
                          </div>
                        ))}
                        {(!song.solos || song.solos.length === 0) && (
                          <p className="text-[9px] font-bold opacity-20 italic py-1">Assign solo parts to team members</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedSet.team_members?.map(member => (
                          <button
                            key={member.userId}
                            onClick={() => {
                              if ((song.solos || []).includes(member.nickname)) return
                              const updated = [...(song.solos || []), member.nickname]
                              updatePracticeSong(songIdx, 'solos', updated)
                            }}
                            className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-zinc-800 text-zinc-400 hover:bg-amber-500/30 hover:text-amber-400' : 'bg-zinc-100 text-zinc-500 hover:bg-amber-500/10 hover:text-amber-600'}`}
                          >
                            + {member.nickname} <span className="opacity-40 ml-1 font-bold">({member.role?.split(' ')[0]})</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sheet Section */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-icons text-[14px] text-[#9c7eb7]">description</span>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Sheet Music</p>
                      </div>
                      {song.sheetUrl ? (
                        <div className="flex gap-2">
                          <a href={song.sheetUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 rounded-2xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-emerald-500/20">
                            <span className="material-icons text-sm">visibility</span>
                            View Sheet
                          </a>
                        </div>
                      ) : (
                        <button onClick={() => findSheet(song.title)} className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isDarkMode ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>
                          <span className="material-icons text-sm">search</span>
                          Search Sheet Online
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )
      })()}

      {/* Add Set Modal */}
      {isAddModalOpen && (
        <div className={`fixed inset-0 z-[110] flex flex-col animate-in fade-in zoom-in duration-300 ${bgColor} no-scrollbar overflow-y-auto`}>
          <header className="px-6 pt-16 pb-6 flex items-center justify-between border-b border-zinc-500/10 sticky top-0 bg-inherit z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => { setIsAddModalOpen(false); setEditingSetId(null); }} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-500/10"><span className="material-icons text-xl">close</span></button>
              {editingSetId && currentUser?.role === 'leader' && (
                <button onClick={deleteSet} className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all" title="Delete Set">
                  <span className="material-icons text-xl">delete</span>
                </button>
              )}
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest opacity-40">{editingSetId ? "Edit Setlist" : "Create Setlist"}</h2>
            <button onClick={saveSet} disabled={isSaving} className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest bg-[#9c7eb7] text-white shadow-lg active:scale-90 transition-all flex items-center gap-1.5 ${isSaving ? 'opacity-70' : ''}`}>
              {isSaving && <span className="material-icons text-sm animate-spin">sync</span>}
              {isSaving ? 'Saving...' : 'Save All'}
            </button>
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
              <div className="space-y-4 p-4 rounded-[32px] border border-zinc-500/10 bg-zinc-500/5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#9c7eb7]">Select Team Members</p>
                      <button 
                        onClick={(e) => { e.preventDefault(); fetchTeamOptions(); }}
                        className="w-6 h-6 rounded-full bg-[#9c7eb7]/10 text-[#9c7eb7] flex items-center justify-center hover:bg-[#9c7eb7]/20 transition-all"
                        title="Reload Members"
                      >
                        <span className={`material-icons text-[14px] ${isFetchingTeam ? 'animate-spin' : ''}`}>sync</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search name..." 
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        className={`w-32 sm:w-48 px-4 py-2 rounded-xl text-[10px] font-bold outline-none border transition-all ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                    {isFetchingTeam && teamOptions.length === 0 ? (
                      <div className="col-span-full py-10 flex flex-col items-center gap-3 opacity-30">
                        <span className="material-icons animate-spin text-2xl">sync</span>
                        <p className="text-[10px] font-black uppercase tracking-widest">Loading Team...</p>
                      </div>
                    ) : teamOptions.length > 0 ? (
                      (() => {
                        const filtered = teamOptions.filter(opt => 
                          (opt.nickname || '').toLowerCase().includes(memberSearch.toLowerCase()) || 
                          (opt.username || '').toLowerCase().includes(memberSearch.toLowerCase())
                        )
                        
                        if (filtered.length === 0) {
                          return <div className="col-span-full py-10 text-center opacity-30 italic text-[10px]">No members found matching "{memberSearch}"</div>
                        }

                        return filtered.map(opt => {
                          const isSelected = newTeam.some(m => m.userId === opt.id)
                          return (
                            <button 
                              key={opt.id} 
                              onClick={() => addTeamMember(opt.id, opt.nickname)}
                              className={`w-full px-5 py-4 rounded-2xl transition-all flex items-center justify-between border ${isSelected ? 'bg-[#9c7eb7] text-white border-transparent shadow-lg scale-[1.02]' : cardBg + ' border-zinc-500/10 hover:border-[#9c7eb7]/30'}`}
                            >
                              <div className="flex flex-col items-start">
                                <span className="text-[11px] font-black uppercase tracking-tight">{opt.nickname}</span>
                                <span className={`text-[8px] font-bold opacity-40 ${isSelected ? 'text-white/60' : ''}`}>{opt.username}</span>
                              </div>
                              {isSelected ? (
                                <span className="material-icons text-sm">check_circle</span>
                              ) : (
                                <span className="material-icons text-sm opacity-10">add_circle_outline</span>
                              )}
                            </button>
                          )
                        })
                      })()
                    ) : !isFetchingTeam && (
                      <div className="col-span-full py-10 text-center opacity-30 italic text-[10px]">
                        No members found. Try clicking the sync button above.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pb-20">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-30 pl-2">General Notes</p>
              <textarea placeholder="Instructions for the whole team..." value={newNotes} onChange={(e)=>setNewNotes(e.target.value)} className={`w-full h-32 p-6 rounded-[32px] outline-none font-bold ${cardBg} border resize-none`} />
            </div>

            {/* Action Buttons */}
            <div className="pt-6 pb-12 border-t border-zinc-500/10 flex items-center justify-end gap-4">
              <button onClick={() => { setIsAddModalOpen(false); setEditingSetId(null); }} className="px-6 py-4 rounded-full font-black text-xs uppercase tracking-widest bg-zinc-500/10 transition-all">Cancel</button>
              <button onClick={saveSet} disabled={isSaving} className={`px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest bg-[#9c7eb7] text-white shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${isSaving ? 'opacity-70' : ''}`}>
                {isSaving && <span className="material-icons text-sm animate-spin">sync</span>}
                {isSaving ? 'Saving...' : (editingSetId ? "Update Set List" : "Save Set List")}
              </button>
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
      className={`${cc} rounded-[28px] p-3 flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-300 shadow-lg group select-none`}
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
          className="bg-transparent text-[10px] font-bold text-white/60 outline-none w-full placeholder-white/20 truncate"
          placeholder="Artist"
        />
        <input 
          type="text"
          value={song.link}
          onChange={(e) => updateSong(index, 'link', e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          className="bg-white/10 text-[8px] font-medium text-white/40 outline-none w-full px-2 py-1 rounded-lg mt-1 placeholder-white/10"
          placeholder="Paste URL here..."
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-end justify-between pt-2 border-t border-white/5 mt-1 w-full px-1">
        
        {/* Key Button */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-[6px] font-black text-white/30 uppercase tracking-[0.1em] leading-none">Key</span>
          <select
            value={song.key}
            onChange={(e) => updateSong(index, 'key', e.target.value)}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full bg-white/10 text-white text-[10px] font-black outline-none cursor-pointer appearance-none text-center hover:bg-white/20 transition-all border border-white/5"
          >
            {KEYS.map(k => <option key={k} value={k} className="text-black">{k}</option>)}
          </select>
        </div>
        
        {/* Search */}
        <button 
          onClick={(e) => { e.stopPropagation(); findSheet(song.title); }} 
          onPointerDown={(e) => e.stopPropagation()}
          className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all shrink-0 border border-white/5" 
          title="Search Web for Sheet"
        >
          <span className="material-icons text-[12px]">search</span>
        </button>
        
        {/* Upload */}
        <div className="relative shrink-0 flex items-center justify-center">
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
            className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all shrink-0 border border-white/5 ${song.sheetUrl ? 'bg-green-500/80 text-white border-transparent' : 'bg-white/10 text-white hover:bg-white/20'} ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            title={song.sheetUrl ? "Sheet Uploaded (Click to replace)" : "Upload Sheet File"}
          >
            {isUploading ? (
              <span className="material-icons text-[12px] animate-spin">sync</span>
            ) : (
              <span className="material-icons text-[12px]">{song.sheetUrl ? "check" : "upload_file"}</span>
            )}
          </label>
        </div>

        {/* View Sheet */}
        {song.sheetUrl && (
          <a 
            href={song.sheetUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center hover:bg-green-500/30 transition-all shrink-0 border border-green-500/10" 
            title="View Sheet"
          >
            <span className="material-icons text-[12px]">visibility</span>
          </a>
        )}

        {/* Play Link */}
        {song.link && (
          <a 
            href={song.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 shrink-0 transition-all border border-white/5" 
            title="Open Original"
          >
            <span className="material-icons text-white text-[12px]">play_arrow</span>
          </a>
        )}
      </div>
    </div>
  )
}

